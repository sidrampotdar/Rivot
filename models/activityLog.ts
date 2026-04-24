import mongoose, { Document, Model, Schema } from "mongoose";

export interface ActivityLogDocument extends Document {
  taskId: mongoose.Types.ObjectId;
  action: string;
  performedBy: mongoose.Types.ObjectId;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const ActivityLogSchema: Schema<ActivityLogDocument> = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    action: { type: String, required: true, trim: true },
    performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    details: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const ActivityLog: Model<ActivityLogDocument> =
  mongoose.models.ActivityLog ||
  mongoose.model<ActivityLogDocument>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
