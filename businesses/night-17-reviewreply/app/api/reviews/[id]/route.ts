import { NextRequest, NextResponse } from "next/server";
import { getReviewById } from "../../store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const review = getReviewById(params.id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  return NextResponse.json(review);
}
