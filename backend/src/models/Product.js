import mongoose from "mongoose";

const productSchema =
  new mongoose.Schema(
    {
      name: String,

      packSize: String,

      stock: Number,

      stockPercentage: Number,

      alertLevel: {
        type: String,
        enum: [
          "Critical",
          "Low",
          "Medium",
          "Healthy"
        ]
      },

      warehouse: String
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Product",
  productSchema
);