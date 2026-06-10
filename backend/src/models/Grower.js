import mongoose from "mongoose";

const growerSchema =
  new mongoose.Schema(
    {
      name: String,

      phone: String,

      location: String,

      landArea: Number,

      crop: String,

      cropStage: String,

      riskLevel: {
        type: String,
        enum: [
          "Low",
          "Medium",
          "High"
        ]
      },

      advisory: String
    },
    { timestamps: true }
  );

const Grower = mongoose.models.Grower || mongoose.model("Grower", growerSchema);

export default Grower;