import mongoose from "mongoose";

const visitSchema =
  new mongoose.Schema(
    {
      fieldAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      retailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Retailer"
      },

      grower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grower"
      },

      notes: String,

      status: {
        type: String,
        enum: [
          "Planned",
          "Completed",
          "Cancelled"
        ]
      },

      visitDate: Date
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Visit",
  visitSchema
);