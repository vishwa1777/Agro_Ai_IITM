import mongoose from "mongoose";

const growerSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    location: String,
    village: String,
    land: String,
    landArea: Number,
    crop: String,
    stage: String,
    risk: { type: String, enum: ["High Risk", "Medium Risk", "Low Risk"], default: "Low Risk" },
    riskLevel: { type: String, enum: ["High", "Medium", "Low"], default: "Low" },
    riskScore: { type: Number, default: 0 },
    lastContact: String,
    advisory: String,
    region: String,
    fieldAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Grower || mongoose.model("Grower", growerSchema);