import { NextRequest, NextResponse } from "next/server";
import { commitHistory, generateId } from "../store";
import { generateMessages } from "../generate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diff, persona } = body;

    if (!diff || typeof diff !== "string" || diff.trim().length === 0) {
      return NextResponse.json(
        { error: "A diff is required" },
        { status: 400 }
      );
    }

    const id = generateId();
    const { messages, analysis } = generateMessages(diff, persona || null);

    const commitRequest = {
      id,
      diff,
      persona: persona || null,
      generatedMessages: messages,
      createdAt: new Date().toISOString(),
    };

    commitHistory.unshift(commitRequest);

    // Keep history at 50 max
    if (commitHistory.length > 50) {
      commitHistory.length = 50;
    }

    return NextResponse.json({ commitRequest, analysis });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ history: commitHistory });
}
