import mongoose from "mongoose";


export interface IHubScore {
    autoCount: number,
    transitionCount: number,
    shift1Count: number,
    shift2Count: number,
    shift3Count: number,
    shift4Count: number,
    endgameCount: number,
    teleopCount: number,
    totalCount: number,
    uncounted: number,
    autoPoints: number,
    transitionPoints: number,
    shift1Points: number,
    shift2Points: number,
    shift3Points: number,
    shift4Points: number,
    endgamePoints: number,
    teleopPoints: number,
    totalPoints: number
}

export interface IAlliance {
    alliance: string,
    autoTowerRobot1: string,
    endGameTowerRobot1: string,
    autoTowerRobot2: string,
    endGameTowerRobot2: string,
    autoTowerRobot3: string,
    endGameTowerRobot3: string,
    autoTowerPoints: number,
    totalAutoPoints: number,
    hubScore: IHubScore,
    totalTeleopPoints: number,
    endGameTowerPoints: number,
    totalTowerPoints: number,
    energizedAchieved: boolean,
    superchargedAchieved: boolean,
    traversalAchieved: boolean,
    minorFoulCount: number,
    majorFoulCount: number,
    g206Penalty: boolean,
    adjustPoints: number,
    foulPoints: number,
    rp: number,
    totalPoints: number,
    penalties: string
}

export interface IMatchResult {
    matchID: string,
    eventCode: string,
    matchLevel: string,
    matchNumber: number,
    winningAlliance: number,
    tiebreaker: {
        tiebreakerType: string,
        tiebreakerReason: string
    },
    energizedThreshold: number,
    superchargedThreshold: number,
    traversalThreshold: number,
    alliances: IAlliance[]
}

const HubScoreSchema = new mongoose.Schema<IHubScore>({
    autoCount: { type: Number },
    transitionCount: { type: Number },
    shift1Count: { type: Number },
    shift2Count: { type: Number },
    shift3Count: { type: Number },
    shift4Count: { type: Number },
    endgameCount: { type: Number },
    teleopCount: { type: Number },
    totalCount: { type: Number },
    uncounted: { type: Number },
    autoPoints: { type: Number },
    transitionPoints: { type: Number },
    shift1Points: { type: Number },
    shift2Points: { type: Number },
    shift3Points: { type: Number },
    shift4Points: { type: Number },
    endgamePoints: { type: Number },
    teleopPoints: { type: Number },
    totalPoints: { type: Number },
});

const AllianceSchema = new mongoose.Schema<IAlliance>({
    alliance: { type: String },
    autoTowerRobot1: { type: String },
    endGameTowerRobot1: { type: String },
    autoTowerRobot2: { type: String },
    endGameTowerRobot2: { type: String },
    autoTowerRobot3: { type: String },
    endGameTowerRobot3: { type: String },
    autoTowerPoints: { type: Number },
    totalAutoPoints: { type: Number },
    hubScore: { type: HubScoreSchema, },
    totalTeleopPoints: { type: Number },
    endGameTowerPoints: { type: Number },
    totalTowerPoints: { type: Number },
    energizedAchieved: { type: Boolean },
    superchargedAchieved: { type: Boolean },
    traversalAchieved: { type: Boolean },
    minorFoulCount: { type: Number },
    majorFoulCount: { type: Number },
    g206Penalty: { type: Boolean },
    adjustPoints: { type: Number },
    foulPoints: { type: Number },
    rp: { type: Number },
    totalPoints: { type: Number },
    penalties: { type: String },
});

const MatchResultSchema = new mongoose.Schema<IMatchResult>({
    matchID: {
        type:String,
        required: true,
        unique: true
    },
    eventCode: String,
    matchLevel: { type: String },
    matchNumber: { type: Number },
    winningAlliance: { type: Number },
    tiebreaker: {
        tiebreakerType: { type: String },
        tiebreakerReason: { type: String },
    },
    energizedThreshold: { type: Number },
    superchargedThreshold: { type: Number },
    traversalThreshold: { type: Number },
    alliances: { type: [AllianceSchema], },
});

const MatchResult = mongoose.models?.MatchResult || mongoose.model<IMatchResult>('MatchResult', MatchResultSchema);

export default MatchResult;