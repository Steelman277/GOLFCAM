import { NextRequest, NextResponse } from "next/server";

// Define DB COnnection for getting/storing data
import connectDB from "@/lib/db";
import Event from "@/models/frc-events/Event";
import { IEvent } from "@/models/frc-events/Event";

export async function GET(req: NextRequest) {

    console.log('Fetching Events');

    //Get Events from the DB
    

    try {
        await connectDB();
        const events = await Event.find()
         .sort({ dateStart: -1 })
         .select({ _id: 0, code: 1, divisionCode: 1, name: 1, type: 1, districtCode: 1, city: 1, stateprov: 1, country: 1, dateStart: 1, dateEnd: 1, teams: 1 })
        if (events.length === 0) {
            return NextResponse.json({ error: 'No events found in the database' });
        } else {
            return NextResponse.json(events);
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error retrieving events' }); 
    }

}