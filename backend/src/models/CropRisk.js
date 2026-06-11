import mongoose from "mongoose";

const cropRiskSchema = new mongoose.Schema(
  {
    crop: String,
    riskLevel: { type: String, enum: ["High", "Medium", "Low"], default: "Low" },
    riskScore: Number,
    affectedArea: Number,
    region: String,
    season: String,
    causes: [String],
    recommendation: String,
    grower: { type: mongoose.Schema.Types.ObjectId, ref: "Grower" },
  },
  { timestamps: true }
);

export default mongoose.models.CropRisk || mongoose.model("CropRisk", cropRiskSchema);