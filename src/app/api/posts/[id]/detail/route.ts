import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Like from "@/models/Like";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const post = await Post.findById(id).select("-comments");

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await Comment.find({ postId: id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    const likes = await Like.find({ postId: id }).populate(
      "userId",
      "name avatar"
    );

    return NextResponse.json({
      post,
      comments,
      likes,
      likesCount: likes.length,
      commentsCount: comments.length,
    });
  } catch (error) {
    console.error("Error fetching post detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
