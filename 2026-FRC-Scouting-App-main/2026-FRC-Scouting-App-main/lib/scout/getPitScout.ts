'use server'

import connectDB from "@/lib/db"
import { IPitScout } from "@/models/scout/PitScout"
import PitScout from "@/models/scout/PitScout"

export default async function getPitScout(pistscoutID: string) {

await connectDB()
try{
    const data = await PitScout.findOne({pitscoutID: pistscoutID})
    if (data === null) {
        return (null)
    }
    const report = JSON.stringify(data)
    return(report)
}catch (error){
    return (null)
}

}