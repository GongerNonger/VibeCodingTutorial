import { NextRequest, NextResponse } from "next/server";
import { getReviewById, addResponse } from "../../../store";
import { generateResponse, Tone } from "../../../generate";

const validTones: Tone[] = ["professional", "friendly", "empathetic", "apologetic"];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const review = getReviewById(params.id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const tone: Tone = body.tone || "professional";

    if (!validTones.includes(tone)) {
      return NextResponse.json(
        { error: `Invalid tone. Must be one of: ${validTones.join(", ")}` },
        { status: 400 }
      );
    }

    const responseText = generateResponse(review, tone);
    const saved = addResponse({
      reviewId: review.id,
      tone,
      response: responseText,
    });

    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
