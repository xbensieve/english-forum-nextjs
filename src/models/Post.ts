import { Schema, model, models, Types } from "mongoose";

export interface IPost {
  content: string;
  imageUrls?: string[];
  userId: Types.ObjectId;
  userImage: string;
  userName: string;
  likesCount: number;
  comments: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new Schema<IPost>(
  {
    content: { type: String, required: true, trim: true },
    imageUrls: { type: [String], default: [] },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userImage: { type: String, required: true },
    userName: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = models.Post || model<IPost>("Post", PostSchema);
export default Post;
