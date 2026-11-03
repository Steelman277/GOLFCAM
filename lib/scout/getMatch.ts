'use server'

import connectDB from "@/lib/db"
import { IMatchScout } from "@/models/scout/MatchScout"
import MatchScout from "@/models/scout/MatchScout"


export default async function getMatch(matchID: string) {

await connectDB()
try{
    const data = await MatchScout.findOne({matchID: matchID})
    if (data === null) {
        return (null)
    }
    const report = JSON.stringify(data)
    return(report)
}catch (error){ 
    return (null)
}

}