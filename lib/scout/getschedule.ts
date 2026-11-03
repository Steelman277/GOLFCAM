'use server'

import connectDB from "../db"
import Match from "@/models/frc-events/Match"


export async function getSchedule(eventCode: string) {
    try {
        await connectDB();
        const match = await Match.find({ eventCode: eventCode }).sort({ matchNumber: 1 });
        if (match === null) {
            return null;
        }
        return JSON.stringify(match);
    } catch (error) {
        console.log(error);
        return null;
    }
}