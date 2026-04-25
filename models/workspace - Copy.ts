import mongoose, { Document, Model, Schema } from "mongoose";

export interface WorkspaceDocument extends Document {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const WorkspaceSchema: Schema<WorkspaceDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Workspace: Model<WorkspaceDocument> =
  mongoose.models.Workspace ||
  mongoose.model<WorkspaceDocument>("Workspace", WorkspaceSchema);

export default Workspace;
