import { NextRequest, NextResponse } from "next/server";
import { detectBias } from "@/lib/bias-detector";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.text || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Text field is required" },
        { status: 400 }
      );
    }

    const matches = detectBias(body.text);
    return NextResponse.json({
      matches,
      score: Math.max(0, 100 - matches.length * 10),
      totalIssues: matches.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check for bias" },
      { status: 500 }
    );
  }
}
