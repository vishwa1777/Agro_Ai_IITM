import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: String,
        category: String,
        stock: Number,
        quantity: Number,
        capacity: Number,
        maxStock: Number,
        unit: String,
        packSize: String,
        pack: String,
        alertLevel: {
            type: String,
            enum: ["Critical", "Low", "Medium", "Healthy"],
            default: "Healthy",
        },
        price: Number,
        manufacturer: String,
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
