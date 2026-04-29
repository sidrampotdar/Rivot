import mongoose, { Document, Model, Schema } from "mongoose";

export type TaskPriority = "low" | "medium" | "high";
export type TaskType = "epic" | "story" | "task" | "bug" | "subtask";

export interface TaskDocument extends Document {
  key: string;
  title: string;
  description?: string;
  type: TaskType;
  columnId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  priority: TaskPriority;
  labels: string[];
  storyPoints?: number;
  dueDate?: Date;
  order: number;
  parentId?: mongoose.Types.ObjectId;
  epicId?: mongoose.Types.ObjectId;
  sprintId?: mongoose.Types.ObjectId;
  customFields?: Record<string, any>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TaskSchema: Schema<TaskDocument> = new Schema(
  {
    key: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["epic", "story", "task", "bug", "subtask"],
      default: "task",
    },
    columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    labels: [{ type: String }],
    storyPoints: { type: Number, default: null },
    dueDate: { type: Date, default: null },
    order: { type: Number, required: true, default: 0 },
    parentId: { type: Schema.Types.ObjectId, ref: "Task", default: null },
    epicId: { type: Schema.Types.ObjectId, ref: "Task", default: null },
    sprintId: { type: Schema.Types.ObjectId, ref: "Sprint", default: null },
    customFields: { type: Schema.Types.Mixed, default: {} },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Task: Model<TaskDocument> =
  mongoose.models.Task || mongoose.model<TaskDocument>("Task", TaskSchema);

export default Task;
