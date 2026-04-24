import mongoose, { Document, Model, Schema } from "mongoose";

export interface BoardDocument extends Document {
  name: string;
  projectId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BoardSchema: Schema<BoardDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Board: Model<BoardDocument> =
  mongoose.models.Board || mongoose.model<BoardDocument>("Board", BoardSchema);

export default Board;
