import mongoose from "mongoose";


// Team data model for storing team info retrieved from the FRC-Events API
export interface ITeam {
    number: number;
    name: string;
}

export const TeamSchema = new mongoose.Schema<ITeam>({
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
});

const Team = mongoose.models?.Team || mongoose.model<ITeam>('Team', TeamSchema);

export default Team;