import mongoose, { Document, Model, Schema } from "mongoose";

export interface ColumnDocument extends Document {
  name: string;
  boardId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
}

const ColumnSchema: Schema<ColumnDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Column: Model<ColumnDocument> =
  mongoose.models.Column ||
  mongoose.model<ColumnDocument>("Column", ColumnSchema);

export default Column;
