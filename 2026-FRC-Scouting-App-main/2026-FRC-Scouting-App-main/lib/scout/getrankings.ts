'use server'

import connectDB from "../db"
import Ranking from "@/models/frc-events/Ranking"


export async function getRankings(eventCode: string) {
    try {
        await connectDB();
        const ranking = await Ranking.find({ eventCode: eventCode }).sort({ rank: 1 });
        if (ranking === null) {
            return null;
        }
        return JSON.stringify(ranking);
    } catch (error) {
        console.log(error);
        return null;
    }
} 