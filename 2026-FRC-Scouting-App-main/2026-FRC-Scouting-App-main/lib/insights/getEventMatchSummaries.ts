'use server'

import connectDB from '../db';
import MatchSummary from '@/models/insights/MatchSummary';
import { IMatchSummary } from '@/models/insights/MatchSummary';


export async function getEventMatchSummaries(eventCode: string) {
    await connectDB();
    const matchSummaries = await MatchSummary.find({ eventCode: eventCode }).sort({ matchNumber: 1 });
    return JSON.stringify(matchSummaries);
}