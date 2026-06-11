import mongoose from "mongoose";

const retailerSchema = new mongoose.Schema(
  {
    name: String,
    owner: String,
    phone: String,
    location: String,
    address: String,
    status: { type: String, enum: ["Active", "Inactive", "Low Stock"], default: "Active" },
    stockLevel: { type: String, enum: ["Critical", "Low Stock", "Medium", "Healthy"], default: "Healthy" },
    alertLevel: { type: String, enum: ["Critical", "Low Stock", "Medium", "Healthy"], default: "Healthy" },
    outstanding: { type: Number, default: 0 },
    outstandingBalance: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    lastVisit: String,
    region: String,
  },
  { timestamps: true }
);

export default mongoose.models.Retailer || mongoose.model("Retailer", retailerSchema);