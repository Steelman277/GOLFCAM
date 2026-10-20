import mongoose from 'mongoose';

export interface IExample {
    idVariable: string,
    textVariable: string,
    arrayOfText: string[],
    object: {
        nestedText: string;
    },
}

const ExampleSchema = new mongoose.Schema({
    idVariable: {
        type: String,
        required: true,
        unique: true,
    },
    textVariable: {
        type: String,
        required: true,
    },
    arrayOfText: {
        type: [String],
        required: true,
    },
    object: {
        nestedText: {
            type: String,
            required: true,
        },
    },
});

const Example = mongoose.models?.Example || mongoose.model<IExample>('Example', ExampleSchema);

export default Example;