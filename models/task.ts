import mongoose, { Document, Model, Schema } from "mongoose";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskDocument extends Document {
  title: string;
  description?: string;
  columnId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  priority: TaskPriority;
  dueDate?: Date;
  order: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TaskSchema: Schema<TaskDocument> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, default: null },
    order: { type: Number, required: true, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Task: Model<TaskDocument> =
  mongoose.models.Task || mongoose.model<TaskDocument>("Task", TaskSchema);

export default Task;
