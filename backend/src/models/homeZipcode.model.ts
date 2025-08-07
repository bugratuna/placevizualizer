import mongoose, { Schema, Model } from "mongoose";
import { IHomeZipcode } from "../types";

const HomeZipcodeSchema: Schema = new Schema(
  {
    pid: {
      type: String,
      required: true,
      index: true,
    },
    locations: {
      type: Map,
      of: Number,
    },
  },
  {
    timestamps: true,
  },
);

const HomeZipcode: Model<IHomeZipcode> = mongoose.model<IHomeZipcode>(
  "home_zipcodes",
  HomeZipcodeSchema,
);

export default HomeZipcode;
