import { NextRequest, NextResponse } from 'next/server';

// Define DB COnnection for getting/storing data
import connectDB from "@/lib/db";
import CurrentEvent from "@/models/frc-events/CurrentEvent";
import MatchSummary from '@/models/insights/MatchSummary';
const currentDate = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));
console.log('Current Date: ' + currentDate);


export async function GET(req: NextRequest) {
    // Load Data Sources
    const events: string[] = ['MIMIL']
    /*
    try {
        await connectDB();
        const currentEvents = await CurrentEvent.findOne({ ID: currentDate.toString() });
        if (currentEvents === null) {
            return NextResponse.json({ error: 'No current events found in the database' });
        }
        const eventsList = currentEvents?.events;
        if (eventsList === null) {
            return NextResponse.json({ error: 'No events found in the database' });
        }
        for (const event of eventsList) {
            events.push(event.code);
        }
    }   catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error retrieving current event codes.' });
    }
    */
    console.log(events)

    interface IMatchSummary {
        eventCode: string,
        tournamentLevel: string,
        matchNumber: number,
        autoClimb: number,
        endgameClimb: number,
        allianceTotalFuel: number,
        allianceAutoFuel: number,
        allianceFirstShiftFuel: number,
        allianceSecondShiftFuel: number,
        allianceEndgameFuel: number,
        adjAutoFuel: number,
        adjFirstShiftFuel: number,
        adjSecondShiftFuel: number,
        adjEndgameFuel: number,
        passHerd: number,
        passLaunched: number,
        robotDied: number,
        robotBroke: number,
    }

    const records: IMatchSummary[] = []


    // Process Events
    for (const event of events) {
        const teams: string[]= []
        
        try{
            const matchTeamSummary = await MatchSummary.find({ eventCode: event }).sort({ matchNumber: 1 });
            
            const summaryRecords = [];
            for (const match of matchTeamSummary) {
                if (!teams.includes(match.teamNumber)) {
                    teams.push(match.teamNumber);
                }

                records.push({
                    eventCode: match.eventCode,
                    tournamentLevel: match.tournamentLevel,
                    matchNumber: match.matchNumber,
                    autoClimb: match.autoClimb,
                    endgameClimb: match.endgameClimb,
                    allianceTotalFuel: match.allianceTotalFuel,
                    allianceAutoFuel: match.allianceAutoFuel,
                    allianceFirstShiftFuel: match.allianceFirstShiftFuel,
                    allianceSecondShiftFuel: match.allianceSecondShiftFuel,
                    allianceEndgameFuel: match.allianceEndgameFuel,
                    adjAutoFuel: match.adjAutoFuel,
                    adjFirstShiftFuel: match.adjFirstShiftFuel,
                    adjSecondShiftFuel: match.adjSecondShiftFuel,
                    adjEndgameFuel: match.adjEndgameFuel,
                    passHerd: match.passHerd,
                    passLaunched: match.passLaunched,
                    robotDied: match.robotDied,
                    robotBroke: match.robotBroke,
                })      



                

            }
        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: 'Error retrieving match results, schedule, and scouts for the event ' + event });
        }

    }
return NextResponse.json(records);

}