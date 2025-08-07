import mongoose, { Schema, Model } from "mongoose";
import { IMyPlace } from "../types";

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const MyPlaceSchema: Schema<IMyPlace> = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    street_address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    logo: { type: String, default: null },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    location: {
      type: PointSchema,
      required: true,
      index: "2dsphere",
    },
    industry: { type: String, required: true },
    isTradeAreaAvailable: { type: Boolean, required: true },
    isHomeZipcodesAvailable: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

const MyPlace: Model<IMyPlace> = mongoose.model<IMyPlace>(
  "my_places",
  MyPlaceSchema,
);

export default MyPlace;
