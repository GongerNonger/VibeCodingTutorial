import { NextRequest, NextResponse } from "next/server";
import { analyzeReview } from "@/lib/engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { review } = body;

    if (!review || typeof review !== "string") {
      return NextResponse.json(
        { error: "Review text is required" },
        { status: 400 }
      );
    }

    const analysis = analyzeReview(review);
    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
