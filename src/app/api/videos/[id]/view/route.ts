import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Video from "@/models/Video";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, views: video.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
