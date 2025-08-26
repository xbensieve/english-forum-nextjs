export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

export interface IComment {
  _id: string;
  content: string;
  createdAt: string;
  userId: IUser;
}

export interface ILike {
  _id: string;
  createdAt: string;
  userId: IUser;
}

export interface IPost {
  _id: string;
  content: string;
  imageUrls?: string[];
  userId: IUser;
  userImage: string;
  userName: string;
  likesCount: number;
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostDetailResponse {
  post: IPost;
  comments: IComment[];
  likes: ILike[];
  likesCount: number;
  commentsCount: number;
}
