import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    month: String,
    year: Number,
    amount: Number,
    revenue: Number,
    region: String,
    target: Number,
    products: Number,
    visits: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Revenue || mongoose.model("Revenue", revenueSchema);