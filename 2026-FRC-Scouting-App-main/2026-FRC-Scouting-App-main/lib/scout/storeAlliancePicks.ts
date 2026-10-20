'use server'
import { IPickList } from "@/models/scout/AlliancePick"
import connectDB from "@/lib/db"
export default async function storeMatch(PickList : IPickList) {
   
    await connectDB()
    try {
    const store = await PickList.findOneAndUpdate({ PickListName: PickList }, PickList, { upsert: true, new: true })
    // const store = await ({fuelScored: match.IFuelNumb})
    console.log("yay it worked it worked it worked it worked.")
    return ({result: true, message: "User Stored Successfully"})
  } catch (error) {
    console.log(error)
    return ({result: false, message: "i do not care if this breaks its fro testing"})
    
  }
}
