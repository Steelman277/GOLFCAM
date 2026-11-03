import mongoose from "mongoose";


interface IMatchTeam {
    teamNumber: number,
    station: string,
    surrogate: boolean
}

interface IEventSchedule {
    matchID: string,
    eventCode: string,
    description: string,
    startTime: Date,
    matchNumber: number,
    field: string,
    tournamentLevel: string,
    teams: IMatchTeam[]
}

const EventScheduleSchema = new mongoose.Schema({
    matchID: {
        type:String,
        required: true,
        unique: true
    },
    eventCode: String,
    description: String,
    startTime: Date,
    matchNumber: Number,
    field: String,
    tournamentLevel: String,
    teams: [
        {
            teamNumber: Number,
            station: String,
            surrogate: Boolean
        }
    ]
});

const EventSchedule = mongoose.models?.EventSchedule || mongoose.model<IEventSchedule>('EventSchedule', EventScheduleSchema);

export default EventSchedule;