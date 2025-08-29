import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await dbConnect();

  const user = await User.findById(id).select("name email avatar").lean();

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
