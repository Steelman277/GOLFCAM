import { NextRequest, NextResponse } from 'next/server';

// Define DB COnnection for getting/storing data
import connectDB from "@/lib/db";
// Match Summary Data
import MatchSummary from '@/models/insights/MatchSummary';
import { IMatchSummary } from '@/models/insights/MatchSummary';



export async function GET(req: NextRequest, { params }: { params: Promise<{ eventCode: string, }> }) {
    const eventCode = (await params).eventCode;
    console.log('Event Code: ' + eventCode);
    await connectDB();

    // Create teamnumber list to iterate through summarization
    const teamNumbers: number[] = [];
    const teamSummariesArray: any[] = [];
    try {
        const matches = await MatchSummary.find({ eventCode: eventCode });
        if (matches === null) {
            return NextResponse.json({ error: 'No matches found in the database' });
        }
        
        for (const match of matches) {
            if (teamNumbers.includes(match.teamNumber)) {
                continue;
            }
            teamNumbers.push(match.teamNumber);
        }

        teamNumbers.sort((a, b) => a - b);

        const AllTeamSummaries: any = {};

        for (const teamNumber of teamNumbers) {
            const teamMatches = matches.filter(match => match.teamNumber === teamNumber);
            const teamSummary = {
                summaryID: eventCode + '-' + teamNumber.toString(),
                eventCode: eventCode,
                teamNumber: teamNumber,
                matchesPlayed: 0,
                autoClimb: 0,
                endgameClimb: 0,
                autoOnlyFuelTotal: 0,
                maxAutoOnlyFuel: 0,
                minAutoOnlyFuel: 0,
                autoFuelTotal: 0,
                firstShiftFuelTotal: 0,
                secondShiftFuelTotal: 0,
                endgameFuelTotal: 0,
                totalFuelTotal: 0,
                maxTotalFuel: 0,
                minTotalFuel: 0,
                avgAutoOnlyFuel: 0,
                avgAutoFuel: 0,
                avgFirstShiftFuel: 0,
                avgSecondShiftFuel: 0,
                avgEndgameFuel: 0,
                avgTotalFuel: 0,
                matchesScouted: 0,
                autoLaunches: 0,
                firstShiftLaunches: 0,
                secondShiftLaunches: 0,
                endgameLaunches: 0,
                passHerdNeutral: 0,
                passHerdOpposing: 0,
                passLaunchedNeutral: 0,
                passLaunchedOpposing: 0,
                defenseNeutral: 0,
                defenseOpposing: 0,
                robotDied: 0,
                robotBroke: 0,
                allianceScouted: 0,
                adjAutoFuel: 0,
                adjFirstShiftFuel: 0,
                adjSecondShiftFuel: 0,
                adjEndgameFuel: 0,
                totalAdjFuel: 0,
                maxAdjFuel: 0,
                minAdjFuel: 0,
                avgAutoLaunches: 0,
                avgFirstShiftLaunches: 0,
                avgSecondShiftLaunches: 0,
                avgEndgameLaunches: 0,
                avgPassHerdNeutral: 0,
                avgPassHerdOpposing: 0,
                avgPassLaunchedNeutral: 0,
                avgPassLaunchedOpposing: 0,
                avgDefenseNeutral: 0,
                avgDefenseOpposing: 0,
                avgRobotDied: 0,
                avgRobotBroke: 0,
                avgAdjAutoFuel: 0,
                avgAdjFirstShiftFuel: 0,
                avgAdjSecondShiftFuel: 0,
                avgAdjEndgameFuel: 0,
                avgTotalAdjFuel: 0,
                
            };


            for (const match of teamMatches) {
                if (match.tournamentLevel === "Qualification") {
                    if (teamSummary.matchesPlayed === 0) {
                        teamSummary.maxAutoOnlyFuel = match.autoOnlyFuel;
                        teamSummary.minAutoOnlyFuel = match.autoOnlyFuel;
                        teamSummary.maxTotalFuel = match.totalFuel;
                        teamSummary.minTotalFuel = match.totalFuel;
                    }
                teamSummary.matchesPlayed++;
                if (match.autoClimb === "None") { teamSummary.autoClimb += 0; }
                if (match.autoClimb === "Level1") { teamSummary.autoClimb += 15; }
                if (match.endgameClimb === "None") { teamSummary.endgameClimb += 0; }
                if (match.endgameClimb === "Level1") { teamSummary.endgameClimb += 10; }
                if (match.endgameClimb === "Level2") { teamSummary.endgameClimb += 20; }
                if (match.endgameClimb === "Level3") { teamSummary.endgameClimb += 30; }
                teamSummary.maxAutoOnlyFuel = Math.max(teamSummary.maxAutoOnlyFuel, match.autoOnlyFuel);
                teamSummary.minAutoOnlyFuel = Math.min(teamSummary.minAutoOnlyFuel, match.autoOnlyFuel);
                teamSummary.autoOnlyFuelTotal += match.autoOnlyFuel;
                teamSummary.autoFuelTotal += match.autoFuel;
                teamSummary.firstShiftFuelTotal += match.firstShiftFuel;
                teamSummary.secondShiftFuelTotal += match.secondShiftFuel;
                teamSummary.endgameFuelTotal += match.endgameFuel;
                teamSummary.totalFuelTotal += match.totalFuel;
                teamSummary.maxTotalFuel = Math.max(teamSummary.maxTotalFuel, match.totalFuel);
                teamSummary.minTotalFuel = Math.min(teamSummary.minTotalFuel, match.totalFuel);
                }
                if (match.scoutedData.teamNumber === teamNumber.toString()) {
                    teamSummary.matchesScouted++;
                    teamSummary.autoLaunches += match.scoutedData.autoLaunches > 0 ? match.scoutedData.autoLaunches : 0;
                    teamSummary.firstShiftLaunches += match.scoutedData.firstShiftLauches > 0 ? match.scoutedData.firstShiftLauches : 0;
                    teamSummary.secondShiftLaunches += match.scoutedData.secondShiftLauches > 0 ? match.scoutedData.secondShiftLauches : 0;
                    teamSummary.endgameLaunches += match.scoutedData.endgameLaunches > 0 ? match.scoutedData.endgameLaunches : 0;
                    teamSummary.passHerdNeutral += match.scoutedData.passHerdNeutral > 0 ? match.scoutedData.passHerdNeutral : 0;
                    teamSummary.passHerdOpposing += match.scoutedData.passHerdOpposing > 0 ? match.scoutedData.passHerdOpposing : 0;
                    teamSummary.passLaunchedNeutral += match.scoutedData.passLaunchedNeutral > 0 ? match.scoutedData.passLaunchedNeutral : 0;
                    teamSummary.passLaunchedOpposing += match.scoutedData.passLaunchedOpposing > 0 ? match.scoutedData.passLaunchedOpposing : 0;
                    teamSummary.defenseNeutral += match.scoutedData.defenseNeutral > 0 ? match.scoutedData.defenseNeutral : 0;
                    teamSummary.defenseOpposing += match.scoutedData.defenseOpposing > 0 ? match.scoutedData.defenseOpposing : 0;
                    teamSummary.robotDied += match.scoutedData.robotDied > 0 ? match.scoutedData.robotDied : 0;
                    teamSummary.robotBroke += match.scoutedData.robotBroke > 0 ? match.scoutedData.robotBroke : 0;
                }
                if (match.allianceScouted) {
                    if (teamSummary.allianceScouted === 0) {
                        teamSummary.maxAdjFuel = match.totalAdjFuel;
                        teamSummary.minAdjFuel = match.totalAdjFuel;
                    }
                    teamSummary.allianceScouted++;
                    teamSummary.adjAutoFuel += match.adjAutoFuel > 0 ? match.adjAutoFuel : 0;
                    teamSummary.adjFirstShiftFuel += match.adjFirstShiftFuel > 0 ? match.adjFirstShiftFuel : 0;
                    teamSummary.adjSecondShiftFuel += match.adjSecondShiftFuel > 0 ? match.adjSecondShiftFuel : 0;
                    teamSummary.adjEndgameFuel += match.adjEndgameFuel > 0 ? match.adjEndgameFuel : 0;
                    teamSummary.totalAdjFuel += match.totalAdjFuel > 0 ? match.totalAdjFuel : 0;
                    teamSummary.maxAdjFuel = Math.max(teamSummary.maxAdjFuel, match.totalAdjFuel);
                    teamSummary.minAdjFuel = Math.min(teamSummary.minAdjFuel, match.totalAdjFuel);
                }
            }
                teamSummary.avgAutoOnlyFuel = Math.floor(teamSummary.autoOnlyFuelTotal / teamSummary.matchesPlayed);
                teamSummary.avgAutoFuel = Math.floor(teamSummary.autoFuelTotal / teamSummary.matchesPlayed);
                teamSummary.avgFirstShiftFuel = Math.floor(teamSummary.firstShiftFuelTotal / teamSummary.matchesPlayed);
                teamSummary.avgSecondShiftFuel = Math.floor(teamSummary.secondShiftFuelTotal / teamSummary.matchesPlayed);
                teamSummary.avgEndgameFuel = Math.floor(teamSummary.endgameFuelTotal / teamSummary.matchesPlayed);
                teamSummary.avgTotalFuel = Math.floor(teamSummary.totalFuelTotal / teamSummary.matchesPlayed);

                teamSummary.avgAutoLaunches = Math.floor(teamSummary.autoLaunches / teamSummary.matchesScouted);
                teamSummary.avgFirstShiftLaunches = Math.floor(teamSummary.firstShiftLaunches / teamSummary.matchesScouted);
                teamSummary.avgSecondShiftLaunches = Math.floor(teamSummary.secondShiftLaunches / teamSummary.matchesScouted);
                teamSummary.avgEndgameLaunches = Math.floor(teamSummary.endgameLaunches / teamSummary.matchesScouted);
                teamSummary.avgPassHerdNeutral = (teamSummary.passHerdNeutral / teamSummary.matchesScouted);
                teamSummary.avgPassHerdOpposing = (teamSummary.passHerdOpposing / teamSummary.matchesScouted);
                teamSummary.avgPassLaunchedNeutral = (teamSummary.passLaunchedNeutral / teamSummary.matchesScouted);
                teamSummary.avgPassLaunchedOpposing = (teamSummary.passLaunchedOpposing / teamSummary.matchesScouted);
                teamSummary.avgDefenseNeutral = (teamSummary.defenseNeutral / teamSummary.matchesScouted);
                teamSummary.avgDefenseOpposing = (teamSummary.defenseOpposing / teamSummary.matchesScouted);
                teamSummary.avgRobotDied = (teamSummary.robotDied / teamSummary.matchesScouted);
                teamSummary.avgRobotBroke = (teamSummary.robotBroke / teamSummary.matchesScouted);
                teamSummary.avgAdjAutoFuel = Math.floor(teamSummary.adjAutoFuel / teamSummary.allianceScouted);
                teamSummary.avgAdjFirstShiftFuel = Math.floor(teamSummary.adjFirstShiftFuel / teamSummary.allianceScouted);
                teamSummary.avgAdjSecondShiftFuel = Math.floor(teamSummary.adjSecondShiftFuel / teamSummary.allianceScouted);
                teamSummary.avgAdjEndgameFuel = Math.floor(teamSummary.adjEndgameFuel / teamSummary.allianceScouted);
                teamSummary.avgTotalAdjFuel = Math.floor(teamSummary.totalAdjFuel / teamSummary.allianceScouted);

            AllTeamSummaries[teamNumber] = teamSummary;
            teamSummariesArray.push(teamSummary);
        }

        //return NextResponse.json(AllTeamSummaries);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error retrieving match results, schedule, and scouts for the event ' + eventCode });
    }


    return NextResponse.json(teamSummariesArray);
    
}