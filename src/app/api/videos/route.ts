import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/Video";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalVideos = await Video.countDocuments();
    const totalPages = Math.ceil(totalVideos / limit);

    return NextResponse.json(
      {
        videos,
        pagination: {
          currentPage: page,
          totalPages,
          totalVideos,
          hasMore: page < totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { title, videoUrl, publicId } = await req.json();

    if (!title || !videoUrl || !publicId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const video = new Video({
      title,
      videoUrl,
      publicId,
      userId: session.user.id,
      userImage: session.user.image || "",
      userName: session.user.name || "",
      views: 0,
    });

    await video.save();

    return NextResponse.json(
      { message: "Video uploaded successfully", video },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
