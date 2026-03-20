import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview } from "../store";

export async function GET() {
  return NextResponse.json(getReviews());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewerName, rating, reviewText, platform, businessName } = body;

    if (!reviewerName || !rating || !reviewText || !platform || !businessName) {
      return NextResponse.json(
        { error: "Missing required fields: reviewerName, rating, reviewText, platform, businessName" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = addReview({ reviewerName, rating, reviewText, platform, businessName });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
