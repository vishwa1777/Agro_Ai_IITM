import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    text: String,
    type: { type: String, enum: ["Visit", "Stock", "Revenue", "Task", "Advisory"], default: "Task" },
    completed: { type: Boolean, default: false },
    dueDate: Date,
    time: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    region: String,
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);