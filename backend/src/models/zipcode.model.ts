import mongoose, { Schema, Model } from 'mongoose';
import { IZipcode } from '../types';

const ZipcodeSchema: Schema<IZipcode> = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        polygon: {
            type: Object,
            required: true,
        },
    },
    {
        timestamps: true,
        _id: false,
    }
);

const Zipcode: Model<IZipcode> = mongoose.model<IZipcode>('zipcodes', ZipcodeSchema);

export default Zipcode;