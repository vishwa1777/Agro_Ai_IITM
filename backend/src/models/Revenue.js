import mongoose from "mongoose";

const revenueSchema =
  new mongoose.Schema(
    {
      month: String,

      year: Number,

      revenue: Number
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Revenue",
  revenueSchema
);