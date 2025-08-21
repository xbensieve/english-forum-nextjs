import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
