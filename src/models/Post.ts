import { Schema, model, models, Types } from "mongoose";

export interface IPost {
  _id?: string;
  content: string;
  userId: Types.ObjectId;
  userImage: string;
  userName: string;
  likes: number;
  comments: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new Schema<IPost>(
  {
    content: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userImage: { type: String, required: true },
    userName: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Post = models.Post || model<IPost>("Post", PostSchema);
export default Post;
