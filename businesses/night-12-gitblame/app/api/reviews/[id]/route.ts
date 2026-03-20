import { NextRequest, NextResponse } from "next/server";
import { getReview } from "../../store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const review = getReview(params.id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  return NextResponse.json(review);
}
