'use server'

import connectDB from "@/lib/db"
import ScoutMatch from "@/models/scout/MatchScout"


export async function getEventScoutedMatches(eventCode: string) {
    try {
        await connectDB();
        const matches = await ScoutMatch.find({ eventCode: eventCode }).sort({ matchNumber: 1 });
        if (matches === null) {
            return null;
        }
        return JSON.stringify(matches);
    } catch (error) {
        console.log(error);
        return null;
    }
}