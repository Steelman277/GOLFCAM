import mongoose from "mongoose";

export interface IPickList {
    findOneAndUpdate(arg0: { PickListName: any; }, match: any, arg2: { upsert: boolean; new: boolean; }): unknown;
    teamNumber: string,
    PickListNumber: number,
   eventCode: string,
   PickListName: string,
   ScoutingTeam: string,
}


export const PickListSchema = new mongoose.Schema<IPickList>(
    {
        eventCode: { type: String },
        teamNumber: { type: String },
        PickListNumber: { type: Number },
        PickListName: { type: String },
        ScoutingTeam: {type: String },
    }
)
    const PickList = mongoose.models?.PickList || mongoose.model<IPickList>("PickList", PickListSchema)

export default PickList;