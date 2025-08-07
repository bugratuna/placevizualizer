import mongoose, { Schema, Model } from "mongoose";
import { ICompetitor } from "../types";

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

const CompetitorSchema: Schema<ICompetitor> = new Schema(
  {
    pid: { type: String, required: true, index: true },
    name: { type: String, required: true },
    street_address: { type: String, required: true },
    city: { type: String, required: true },
    region: { type: String, required: true },
    logo: { type: String, default: null },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    location: {
      type: PointSchema,
      required: true,
      index: "2dsphere",
    },
    sub_category: { type: String, required: true },
    trade_area_activity: { type: Boolean, required: true },
    home_locations_activity: { type: Boolean, required: true },
    distance: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const Competitor: Model<ICompetitor> = mongoose.model<ICompetitor>(
  "competitors",
  CompetitorSchema,
);

export default Competitor;
