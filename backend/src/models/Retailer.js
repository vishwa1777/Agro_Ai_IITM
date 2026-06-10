import mongoose from "mongoose";

const retailerSchema =
  new mongoose.Schema(
    {
        retailer_id: {
          type: String,
          unique: true,
          default: () =>
            `RTL${Date.now()}${Math.floor(
              Math.random() * 1000
            )}`
        },
      name: String,
      owner: String,
      phone: String,
      location: String,

      status: {
        type: String,
        enum: [
          "Active",
          "Inactive",
          "Low Stock"
        ]
      },

      stockLevel: String,

      outstanding: {
        type: Number,
        default: 0
      },

      totalSales: {
        type: Number,
        default: 0
      },

      lastVisit: Date
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Retailer",
  retailerSchema
);