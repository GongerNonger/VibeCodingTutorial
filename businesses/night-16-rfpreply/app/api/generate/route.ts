import { NextRequest, NextResponse } from "next/server";
import { generateResponses } from "@/lib/generator";
import { RFPSection, CompanyProfile, Tone } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sections, profile, tone } = body as {
      sections: RFPSection[];
      profile: CompanyProfile;
      tone?: Tone;
    };

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json(
        { error: "At least one RFP section is required" },
        { status: 400 }
      );
    }

    if (!profile || !profile.name || !profile.description) {
      return NextResponse.json(
        { error: "Company profile with name and description is required" },
        { status: 400 }
      );
    }

    const validTones: Tone[] = ["formal", "persuasive", "technical"];
    const selectedTone: Tone = validTones.includes(tone as Tone) ? (tone as Tone) : "formal";

    const responses = generateResponses(sections, profile, selectedTone);

    return NextResponse.json({ responses });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate responses" },
      { status: 500 }
    );
  }
}
