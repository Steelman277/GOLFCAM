'use server'


import connectDB from "@/lib/db"
import { IPitScout } from "@/models/scout/PitScout"
import PitScout from "@/models/scout/PitScout"

export default async function storePitScout(pitScout: IPitScout) {

await connectDB()
try{
    console.log(pitScout)
    const store = await PitScout.findOneAndUpdate({pitscoutID: pitScout.pitscoutID}, pitScout, {upsert: true, new: true})
    return({result: true, message: "Pit scout report stored sucessfully."})
}catch (error){
    return ({result: false, message: "Error Occured, Could Not Store pit scout report."})
    console.log(error)
}

}