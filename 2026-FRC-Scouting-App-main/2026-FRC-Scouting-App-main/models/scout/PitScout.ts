import mongoose from "mongoose";

export interface IPitScout {
  pitscoutID: string,
  teamNumber: string,
  scoutTeamNumber: string,
  eventCode: string,
  maxFuelCarry: number,
  PassPosition: string,
  scoringPosition: string,
  autonPath: string,
  canGoThroughTrench: boolean,
  intakeType: string,
  autonClimb: number,
  typeHopper: string,
  multishot: number,
  teleopClimb: string,
  launchSpeed: number,
  weight: number,
  //meta data for the file. 
  createdAt: Date,
  updatedAt: Date,
  
}

export const PitScoutSchema = new mongoose.Schema<IPitScout>(
    {
        pitscoutID: {
            type: String,
            required: true,
            unique: true,
        },
        teamNumber: { type: String },
        scoutTeamNumber: { type: String },
        eventCode: { type: String },
        maxFuelCarry: { type: Number },
        PassPosition: { type: String },
        scoringPosition: { type: String },
        autonPath: { type: String },
        autonClimb: { type: Number },
        intakeType: { type: String },
        canGoThroughTrench: { type: Boolean, default: false },
        teleopClimb: { type: String },
        createdAt: { type: Date, default: Date.now, },
        updatedAt: { type: Date, default: Date.now, },
        typeHopper: { type: String },
        multishot: { type: Number },
        launchSpeed: { type: Number },
        weight: { type: Number },
    },
);

const PitScout = mongoose.models?.PitScout || mongoose.model<IPitScout>("PitScout", PitScoutSchema);

export default PitScout;