'use server'


import connectDB from '../db';
import MatchSummary from '@/models/insights/MatchSummary';
import { IMatchSummary } from '@/models/insights/MatchSummary';


export async function getEventTeamSummaries(eventCode: string) {
    await connectDB();
    const matchSummaries = await MatchSummary.find({ eventCode: eventCode }).sort({ matchNumber: 1 });
    const teams: string[] = []
    for (const matchSummary of matchSummaries) {
        if (!teams.includes(matchSummary.teamNumber)) {
            teams.push(matchSummary.teamNumber);
        }
    }

    const teamSummaries = []

    for (const team of teams) {
        let TotalFuel = 0
        let AutoFuel = 0
        let FirstShiftFuel = 0
        let SecondShiftFuel = 0
        let EndgameFuel = 0
        let TeleopFuel = 0
        let AutoClimd = 0
        let EndgameClimb = 0
        let Matches = 0
        let ADJMatches = 0
        let ADJAutoFuel = 0
        let ADJFirstShiftFuel = 0
        let ADJSecondShift = 0
        let ADJEndgame = 0
        let ADJTeleop = 0

        for (const matchSummary of matchSummaries.filter(matchSummary => matchSummary.teamNumber === team)) {
            TotalFuel += matchSummary.totalFuel
            AutoFuel += matchSummary.autoFuel
            FirstShiftFuel += matchSummary.firstShiftFuel
            SecondShiftFuel += matchSummary.secondShiftFuel
            EndgameFuel += matchSummary.endgameFuel
            TeleopFuel += matchSummary.teleopFuel
            AutoClimd += matchSummary.autoClimb
            EndgameClimb += matchSummary.endgameClimb
            Matches += 1
            if (matchSummary.autoAJDFuel) { ADJAutoFuel += matchSummary.adjAutoFuel }
            if (matchSummary.firstShiftAJDFuel) { ADJFirstShiftFuel += matchSummary.adjFirstShiftFuel }
            if (matchSummary.secondShiftAJDFuel) { ADJSecondShift += matchSummary.adjSecondShiftFuel }
            if (matchSummary.endgameAJDFuel) { ADJEndgame += matchSummary.adjEndgameFuel }
            if (matchSummary.scouted ) { ADJMatches++ }
        }

        const teamSummary = {
            teamNumber: team,
            avgTotalFuel: Math.ceil(TotalFuel / Matches),
            avgAutoFuel: Math.ceil(AutoFuel / Matches),
            avgFirstShiftFuel: Math.ceil(FirstShiftFuel / Matches),
            avgSecondShiftFuel: Math.ceil(SecondShiftFuel / Matches),
            avgEndgameFuel: Math.ceil(EndgameFuel / Matches),
            avgTeleopFuel: Math.ceil(TeleopFuel / Matches),
            avgAutoClimb: Math.ceil(AutoClimd / Matches),
            avgEndgameClimb: Math.ceil(EndgameClimb / Matches),
            totalMatches: Matches,
            adjMatches: ADJMatches,
            adjAvgAutoFuel: Math.ceil(ADJAutoFuel / ADJMatches),
            adjAvgFirstShiftFuel: Math.ceil(ADJFirstShiftFuel / ADJMatches),
            adjAvgSecondShiftFuel: Math.ceil(ADJSecondShift / ADJMatches),
            adjAvgEndgameFuel: Math.ceil(ADJEndgame / ADJMatches),

        }

        teamSummaries.push(teamSummary)
    }

    return JSON.stringify(teamSummaries);

}