import { NextRequest, NextResponse } from "next/server";
import { analyzeRFP } from "@/lib/analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "RFP text is required" },
        { status: 400 }
      );
    }

    const sections = analyzeRFP(text);

    return NextResponse.json({ sections });
  } catch {
    return NextResponse.json(
      { error: "Failed to analyze RFP" },
      { status: 500 }
    );
  }
}
