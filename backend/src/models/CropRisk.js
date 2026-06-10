import mongoose from "mongoose";

const cropRiskSchema =
  new mongoose.Schema(
    {
      crop: String,

      riskPercentage: Number,

      riskLevel: {
        type: String,
        enum: [
          "Low",
          "Medium",
          "High"
        ]
      }
    },
    { timestamps: true }
  );

export default mongoose.model(
  "CropRisk",
  cropRiskSchema
);