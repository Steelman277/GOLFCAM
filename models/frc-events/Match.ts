import mongoose from "mongoose";


export interface IMatchTeam {
    teamNumber: number,
    station: string,
    dq: boolean
}

export interface IMatch {
    matchID: string,
    eventCode: string,
    description: string,
    matchVideoLink: string,
    postResultTime: string,
    startTime: Date,
    matchNumber: number,
    scoreRedFinal: number,
    scoreRedFoul: number,
    scoreRedAuto: number,
    scoreBlueFinal: number,
    scoreBlueFoul: number,
    scoreBlueAuto: number,
    tournamentLevel: string,
    isReplay: boolean,
    autoStartTime: Date,
    actualStartTime: Date,
    teams: IMatchTeam[]
}

const MatchSchema = new mongoose.Schema({
    matchID: {
        type:String,
        required: true,
        unique: true
    },
    eventCode: String,
    description: String,
    matchVideoLink: String,
    startTime: Date,
    matchNumber: Number,
    scoreRedFinal: Number,
    scoreRedFoul: Number,
    scoreRedAuto: Number,
    scoreBlueFinal: Number,
    scoreBlueFoul: Number,
    scoreBlueAuto: Number,
    tournamentLevel: String,
    isReplay: Boolean,
    autoStartTime: Date,
    actualStartTime: Date,
    teams: [
        {
            teamNumber: Number,
            station: String,
            dq: Boolean
        }
    ]
});

const Match = mongoose.models?.Match || mongoose.model<IMatch>('Match', MatchSchema);

export default Match;