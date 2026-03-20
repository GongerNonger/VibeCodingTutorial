import { NextRequest, NextResponse } from "next/server";
import { analyzeReview, generateResponse, Tone, Length, BusinessProfile } from "@/lib/engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { review, tone, length, business } = body;

    if (!review || typeof review !== "string") {
      return NextResponse.json(
        { error: "Review text is required" },
        { status: 400 }
      );
    }

    const validTones: Tone[] = ["professional", "friendly", "empathetic", "assertive"];
    const validLengths: Length[] = ["brief", "standard", "detailed"];

    const selectedTone: Tone = validTones.includes(tone) ? tone : "professional";
    const selectedLength: Length = validLengths.includes(length) ? length : "standard";

    const analysis = analyzeReview(review);
    const businessProfile: BusinessProfile | undefined = business
      ? {
          id: business.id || "default",
          name: business.name || "Our Business",
          type: business.type || "general",
          personality: business.personality || "deliver excellent experiences",
        }
      : undefined;

    const response = generateResponse(review, analysis, selectedTone, selectedLength, businessProfile);

    return NextResponse.json({
      ...response,
      analysis,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
