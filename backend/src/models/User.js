import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [
                "admin",
                "manager",
                "field_agent",
                // Extended to match roles defined in seed.js
                "Field Representative",
                "Regional Manager",
                "Agronomist",
                "Sales Executive",
            ],
            default: "field_agent",
        },
        region: String,
        phone: String,
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
