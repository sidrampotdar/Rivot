import mongoose, { Document, Model, Schema } from "mongoose";

export interface ProjectDocument extends Document {
  name: string;
  description?: string;
  workspaceId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ProjectSchema: Schema<ProjectDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Project: Model<ProjectDocument> =
  mongoose.models.Project ||
  mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default Project;
