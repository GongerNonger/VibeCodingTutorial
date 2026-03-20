import { NextRequest, NextResponse } from "next/server";
import { saveProfile, getAllProfiles } from "@/lib/profiles";
import { BusinessProfile } from "@/lib/types";

export async function GET() {
  const profiles = getAllProfiles();
  return NextResponse.json({ profiles, total: profiles.length });
}

export async function POST(request: NextRequest) {
  try {
    const profile: BusinessProfile = await request.json();

    if (!profile.name || !profile.industry || !profile.state) {
      return NextResponse.json(
        { error: "Name, industry, and state are required" },
        { status: 400 }
      );
    }

    const saved = saveProfile(profile);
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
