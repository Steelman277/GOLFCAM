import mongoose from "mongoose";

export interface IMatchScout {
matchID: string,
teamNumber: string,
scoutTeamNumber: string,
eventCode: string,
tournamentLevel: string,
matchNumber: string,
alliancePosition: string,
autoLaunches: number,
firstShiftLauches: number,
secondShiftLauches: number,
endgameLaunches: number,
robotDied: number,
robotBroke: number,
passHerdNeutral: number,
passHerdOpposing: number,
passLaunchedNeutral: number,
passLaunchedOpposing: number,
defenseNeutral: number,
defenseOpposing: number,
createdAt?: Date,
updatedAt: Date,
}

export const MatchScoutschema = new mongoose.Schema<IMatchScout>(
{
    matchID: {
        type:String,
        required: true,
        unique: true
    },
    teamNumber:{ type: String },
    scoutTeamNumber:{ type: String },
    eventCode: { type: String },
    tournamentLevel: { type: String },
    matchNumber: { type: String },
    alliancePosition: { type: String },
    autoLaunches: { type: Number },
    firstShiftLauches: { type: Number },
    secondShiftLauches: { type: Number },
    endgameLaunches: { type: Number },
    robotDied: { type: Number },
    robotBroke: { type: Number },
    passHerdNeutral: { type: Number },
    passHerdOpposing: { type: Number },
    passLaunchedNeutral: { type: Number },
    passLaunchedOpposing: { type: Number },
    defenseNeutral: { type: Number },
    defenseOpposing: { type: Number },
    createdAt: { type: Date, default: Date.now, },
    updatedAt: { type: Date, default: Date.now, },
}
)
const MatchScout = mongoose.models?.MatchScout || mongoose.model<IMatchScout>("MatchScout", MatchScoutschema)

export default MatchScout;