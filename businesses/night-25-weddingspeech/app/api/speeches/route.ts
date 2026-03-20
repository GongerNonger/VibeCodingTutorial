import { NextRequest, NextResponse } from "next/server";
import { addSpeech, getAllSpeeches } from "../store";
import { generateSpeech } from "../generate";

export async function GET() {
  const speeches = getAllSpeeches();
  return NextResponse.json(speeches);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      speakerRole,
      speakerName,
      coupleName1,
      coupleName2,
      howYouKnow,
      favoriteMemory,
      coupleQualities,
      tone,
      length,
    } = body;

    if (
      !speakerRole ||
      !speakerName ||
      !coupleName1 ||
      !coupleName2 ||
      !howYouKnow ||
      !favoriteMemory ||
      !coupleQualities ||
      !tone ||
      !length
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { speech, wordCount, estimatedMinutes } = generateSpeech({
      speakerRole,
      speakerName,
      coupleName1,
      coupleName2,
      howYouKnow,
      favoriteMemory,
      coupleQualities,
      tone,
      length,
    });

    const saved = addSpeech({
      speakerRole,
      speakerName,
      coupleName1,
      coupleName2,
      howYouKnow,
      favoriteMemory,
      coupleQualities,
      tone,
      length,
      generatedSpeech: speech,
      wordCount,
      estimatedMinutes,
    });

    return NextResponse.json(saved);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
