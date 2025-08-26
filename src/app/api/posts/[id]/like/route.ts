import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Like from "@/models/Like";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await params;
    const userId = session.user.id;

    const existingLike = await Like.findOne({ postId, userId }).lean();

    if (existingLike) {
      await Promise.all([
        Like.deleteOne({ _id: existingLike._id }),
        Post.updateOne({ _id: postId }, { $inc: { likesCount: -1 } }),
      ]);
      return NextResponse.json({ liked: false });
    } else {
      await Promise.all([
        Like.create({ postId, userId }),
        Post.updateOne({ _id: postId }, { $inc: { likesCount: 1 } }),
      ]);
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
