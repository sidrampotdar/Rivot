import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserDocument extends Document {
  clerkId: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role?: "admin" | "employee";
  workspaces: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: false, default: null },
    avatar: { type: String, default: null },
    role: { type: String, enum: ["admin", "employee"], default: null },
    workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
