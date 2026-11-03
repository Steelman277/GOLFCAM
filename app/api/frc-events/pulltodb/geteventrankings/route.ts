import { NextRequest, NextResponse } from 'next/server';

// Define DB COnnection for getting/storing data
import connectDB from "@/lib/db";
import CurrentEvent from "@/models/frc-events/CurrentEvent";
import Ranking from '@/models/frc-events/Ranking';
import { IRanking } from "@/models/frc-events/Ranking";


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
            const apiURL = 'https://frc-api.firstinspires.org/v3.0/2026/rankings/' + event.code;
            console.log('Fetching Rankings for ' + event.code);

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
            if (data.Rankings.length === 0) {
                console.log('No rankings found for the event ' + event.code + ' - Skipping')
                continue;
            }

            for (const ranking of data.Rankings) {

                ranking.eventCode = event.code;
                ranking.id = event.code + '-' + ranking.rank;

                await connectDB();
                const rankingDoc = await Ranking.findOneAndUpdate({ id: ranking.id }, ranking, { upsert: true, new: true });
            }
        }

        await connectDB();
        //await CurrentEvent.findOneAndUpdate({ ID: currentDate.toString() }, currentEvent, { upsert: true, new: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error retrieving and storing event rankings' });
    }

    return NextResponse.json({ message: 'Rankings Updated' });
}