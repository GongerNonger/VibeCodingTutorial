import { NextRequest, NextResponse } from "next/server";
import { getAllReviews, createReview } from "../store";

export async function GET() {
  const reviews = getAllReviews();
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, diffText, baseBranch, headBranch } = body;

    if (!title || !diffText) {
      return NextResponse.json(
        { error: "Title and diff text are required" },
        { status: 400 }
      );
    }

    const review = createReview({
      title: title || "",
      description: description || "",
      diffText: diffText || "",
      baseBranch: baseBranch || "main",
      headBranch: headBranch || "feature-branch",
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
