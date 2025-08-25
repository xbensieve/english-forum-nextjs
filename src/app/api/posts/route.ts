import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { content, imageUrls } = await req.json();
  await dbConnect();
  const post = await Post.create({
    content,
    imageUrls: imageUrls || [],
    userId: session.user.id,
    userImage: session.user.image || "",
    userName: session.user.name || "",
    likes: 0,
    comments: [],
  });
  return NextResponse.json(post, { status: 201 });
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments();

  return NextResponse.json(
    {
      posts,
      total,
      hasMore: skip + posts.length < total,
    },
    { status: 200 }
  );
}
