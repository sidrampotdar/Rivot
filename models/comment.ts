import mongoose, { Document, Model, Schema } from "mongoose";

export interface CommentDocument extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema<CommentDocument> = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Comment: Model<CommentDocument> =
  mongoose.models.Comment || mongoose.model<CommentDocument>("Comment", CommentSchema);

export default Comment;
