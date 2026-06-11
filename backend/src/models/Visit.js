import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
    {
        fieldAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        retailer: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer" },
        grower: { type: mongoose.Schema.Types.ObjectId, ref: "Grower" },
        status: {
            type: String,
            enum: ["completed", "pending", "cancelled", "rescheduled"],
            default: "pending",
        },
        date: Date,
        notes: String,
        orderValue: Number,
        purpose: String,
        region: String,
    },
    { timestamps: true }
);

export default mongoose.models.Visit || mongoose.model("Visit", visitSchema);
