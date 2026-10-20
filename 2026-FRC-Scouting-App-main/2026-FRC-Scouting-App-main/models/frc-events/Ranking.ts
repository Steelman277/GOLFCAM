import mongoose from 'mongoose';

export interface IRanking {
    id: string,
    eventCode: string,
    rank: number,
    teamNumber: number,
    sortOrder1: number,
    sortOrder2: number,
    sortOrder3: number,
    sortOrder4: number,
    sortOrder5: number,
    sortOrder6: number,
    wins: number,
    losses: number,
    ties: number,
    qualAverage: number,
    dq: number,
    matchesPlayed: number,
}

const RankingSchema = new mongoose.Schema<IRanking>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    eventCode: {
        type: String,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
    },
    teamNumber: {
        type: Number,
        required: true,

    },
    sortOrder1: {
        type: Number,
        required: true,

    },
    sortOrder2: {
        type: Number,
        required: false,
 
    },
    sortOrder3: {
        type: Number,
        required: false,
  
    },
    sortOrder4: {
        type: Number,
        required: false,
   
    },
    sortOrder5: {
        type: Number,
        required: false,
     
    },
    sortOrder6: {
        type: Number,
        required: false,
      
    },
    wins: {
        type: Number,
        required: true,
 
    },
    losses: {
        type: Number,
        required: true,
  
    },
    ties: {
        type: Number,
        required: true,
   
    },
    qualAverage: {
        type: Number,
        required: true,
     
    },
    dq: {
        type: Number,
        required: false,
       
    },
    matchesPlayed: {
        type: Number,
        required: true,
      
    },
});

const Ranking = mongoose.models?.Ranking || mongoose.model<IRanking>('Ranking', RankingSchema);

export default Ranking;