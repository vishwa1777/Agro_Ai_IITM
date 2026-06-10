import mongoose from "mongoose";

const taskSchema =
  new mongoose.Schema(
    {
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      title: String,

      type: String,

      dueTime: Date,

      completed: {
        type: Boolean,
        default: false
      }
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Task",
  taskSchema
);