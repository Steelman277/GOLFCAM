import { NextRequest, NextResponse } from 'next/server';

// Define DB COnnection for getting/storing data
import connectDB from "@/lib/db";
import CurrentEvent from "@/models/frc-events/CurrentEvent";
import MatchResult from '@/models/frc-events/MatchResult';


const currentDate = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));
console.log('Current Date: ' + currentDate);


export async function GET(req: NextRequest) {

    try {
        await connectDB();
        const currentEvent = await CurrentEvent.findOne({ ID: currentDate.toString() });
        const events = currentEvent?.events;
        if (events === null) {
            return NextResponse.json({ error: 'No events found in the database' });
        }


        for (const event of events) {
            //Get Qualification Matches from Match Results
            const apiURL = 'https://frc-api.firstinspires.org/v3.0/2026/scores/' + event.code + '/Qualification';
            console.log('Fetching Qualification Match Results for ' + event.code);

            // Fetch data from FRC-Events API
            const response = await fetch(`${apiURL}`,
                {
                    headers: {
                        'Authorization': `Basic ${process.env.FRC_AUTH}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch data from FRC-Events API');
            }
            const data = await response.json();

            // Check if data is empty
            if (data.MatchScores.length === 0) {
                console.log('No Qualification Matches found for the event ' + event.code + ' - Skipping')
                continue;
            }

            for (const match of data.MatchScores) {
                match.eventCode = event.code;
                match.matchID = event.code + '-' + match.matchLevel + '-' + match.matchNumber.toString();

                await connectDB();
                const matchDoc = await MatchResult.findOneAndUpdate({ matchID: match.matchID }, match, { upsert: true, new: true });
            }

            //Get Playoff Matches from Match Results
            const apiURL2 = 'https://frc-api.firstinspires.org/v3.0/2026/scores/' + event.code + '/Playoff';
            console.log('Fetching Playoff Matches for ' + event.code);

            // Fetch data from FRC-Events API
            const response2 = await fetch(`${apiURL2}`,
                {
                    headers: {
                        'Authorization': `Basic ${process.env.FRC_AUTH}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response2.ok) {
                throw new Error('Failed to fetch data from FRC-Events API');
            }
            const data2 = await response2.json();

            // Check if data is empty
            if (data2.MatchScores.length === 0) {
                console.log('No Playoff Matches found for the event ' + event.code + ' - Skipping')
                continue;
            }

            for (const match of data2.MatchScores) {
                match.eventCode = event.code;
                match.matchID = event.code + '-' + match.matchLevel + '-' + match.matchNumber.toString();

                await connectDB();
                const matchDoc = await MatchResult.findOneAndUpdate({ matchID: match.matchID }, match, { upsert: true, new: true });
            }

        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error retrieving and storing event matches' });
    }

    return NextResponse.json({ message: 'Matches Updated' });
}