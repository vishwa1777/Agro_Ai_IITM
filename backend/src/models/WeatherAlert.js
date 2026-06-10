import mongoose from "mongoose";

const weatherSchema =
  new mongoose.Schema(
    {
      region: String,

      alertType: String,

      temperature: Number,

      probability: Number,

      description: String
    },
    { timestamps: true }
  );

export default mongoose.model(
  "WeatherAlert",
  weatherSchema
);