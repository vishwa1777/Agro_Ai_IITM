import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    pack: String,
    stock: Number,
    pct: Number,
    level: {
      type: String,
      enum: ["Critical", "Low", "Medium", "Healthy"],
      default: "Healthy"
    },
    demand: [String],
    supply: [String],
    action: String
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);