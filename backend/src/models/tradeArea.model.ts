import mongoose, { Schema, Model } from 'mongoose';
import { ITradeArea } from '../types';

const TradeAreaSchema: Schema<ITradeArea> = new Schema(
    {
        pid: {
            type: String,
            required: true,
            index: true,
        },
        trade_area: {
            type: Number,
            required: true,
        },
        polygon: {
            type: Object,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const TradeArea: Model<ITradeArea> = mongoose.model<ITradeArea>('trade_areas', TradeAreaSchema);

export default TradeArea;