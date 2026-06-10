import mongoose from "mongoose";

const recommendationSchema =
  new mongoose.Schema(
    {
      title: String,

      description: String,

      priority: {
        type: String,
        enum: [
          "Low",
          "Medium",
          "High"
        ]
      },

      generatedFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Recommendation",
  recommendationSchema
);