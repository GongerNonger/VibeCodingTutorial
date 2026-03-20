import { NextRequest, NextResponse } from "next/server";
import { grants } from "@/lib/grants";
import { matchGrants } from "@/lib/matcher";
import { BusinessProfile } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const profile: BusinessProfile = await request.json();

    if (!profile.industry || !profile.state) {
      return NextResponse.json(
        { error: "Industry and state are required" },
        { status: 400 }
      );
    }

    const matches = matchGrants(profile, grants);

    return NextResponse.json({
      matches,
      total: matches.length,
      profile: {
        name: profile.name,
        industry: profile.industry,
        state: profile.state,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
