import { NextRequest, NextResponse } from 'next/server';

// Define DB COnnection for getting/storing data
import connectDB from "@/lib/db";
import Event from "@/models/frc-events/Event";
import CurrentEvent from "@/models/frc-events/CurrentEvent";
import { IEventSimple, ICurrentEvent } from "@/models/frc-events/CurrentEvent";


const currentDate = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));
console.log('Current Date: ' + currentDate);


export async function GET(req: NextRequest) {
    const eventsSimple: IEventSimple[] = [];

    try {
        await connectDB();
        const events = await Event.find()
         .sort({ dateStart: -1 })
         .select({ _id: 0, code: 1, divisionCode: 1, name: 1, type: 1, districtCode: 1, city: 1, stateprov: 1, country: 1, dateStart: 1, dateEnd: 1, teams: 1 })
        for (const event of events) {
            const startDate = parseInt(event.dateStart.toISOString().split('T')[0].replace(/-/g, ''));
            const endDate = parseInt(event.dateEnd.toISOString().split('T')[0].replace(/-/g, ''));
            if (startDate <= (currentDate) && endDate >= (currentDate) && event.code === 'MICMP3') {
            //if (startDate <= (currentDate) && event.districtCode === 'FIM') {
                console.log('Setting as Current Event ' + event.code + ' - ' + startDate + ' - ' + endDate);
                eventsSimple.push({
                    code: event.code,
                    divisionCode: event.divisionCode,
                    name: event.name,
                    type: event.type,
                    districtCode: event.districtCode,
                    city: event.city,
                    stateprov: event.stateprov,
                    country: event.country,
                    dateStart: event.dateStart,
                    dateEnd: event.dateEnd,
                });
            }
        }

        const currentEvent: ICurrentEvent = {
            ID: currentDate.toString(),
            events: eventsSimple,
        };

        await connectDB();
        await CurrentEvent.findOneAndUpdate({ ID: currentDate.toString() }, currentEvent, { upsert: true, new: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error retrieving events' });
    }

    return NextResponse.json({ message: 'Events Updated' });
}