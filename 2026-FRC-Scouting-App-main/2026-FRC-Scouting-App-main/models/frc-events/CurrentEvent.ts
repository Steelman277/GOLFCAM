import mongoose from 'mongoose';



export interface IEventSimple {
    code: string,
    divisionCode: string,
    name: string,
    type: string,
    districtCode: string,
    city: string,
    stateprov: string,
    country: string,
    dateStart: Date,
    dateEnd: Date,
}


export interface ICurrentEvent {
            ID: string,
            events: IEventSimple[],
        }




const EventSimpleSchema = new mongoose.Schema<IEventSimple>({
    code: {
        type: String,
        required: true,
    },
    divisionCode: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    districtCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    stateprov: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    dateStart: {
        type: Date,
        required: true,
    },
    dateEnd: {
        type: Date,
        required: true,
    },
});

const CurrentEventSchema = new mongoose.Schema<ICurrentEvent>({
    ID: {
        type: String,
        required: true,
        unique: true,
    },
    events: {
        type: [EventSimpleSchema],
        required: true,
    },
});

const CurrentEvent = mongoose.models?.CurrentEvent || mongoose.model<ICurrentEvent>('CurrentEvent', CurrentEventSchema);

export default CurrentEvent;