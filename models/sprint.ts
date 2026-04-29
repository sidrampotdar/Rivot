import mongoose, { Document, Model, Schema } from "mongoose";

export interface SprintDocument extends Document {
  name: string;
  goal?: string;
  projectId: mongoose.Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  status: "planned" | "active" | "completed";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SprintSchema: Schema<SprintDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    goal: { type: String, default: "" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["planned", "active", "completed"],
      default: "planned",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Sprint: Model<SprintDocument> =
  mongoose.models.Sprint ||
  mongoose.model<SprintDocument>("Sprint", SprintSchema);

export default Sprint;
