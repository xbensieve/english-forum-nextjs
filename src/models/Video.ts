import mongoose, { Schema, model, models } from "mongoose";

export interface IVideo {
  title: string;
  videoUrl: string;
  publicId: string;
  userId: mongoose.Types.ObjectId;
  userImage: string;
  userName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userImage: { type: String, required: true },
    userName: { type: String, required: true },
  },
  { timestamps: true }
);

const Video = models.Video || model<IVideo>("Video", videoSchema);

export default Video;
