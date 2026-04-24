import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  workspaces: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
