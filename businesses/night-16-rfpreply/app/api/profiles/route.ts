import { NextRequest, NextResponse } from "next/server";
import { getAllProfiles, saveProfile, getProfile } from "@/lib/store";
import { CompanyProfile } from "@/lib/types";

export async function GET() {
  const profiles = getAllProfiles();
  return NextResponse.json({ profiles });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, capabilities, pastProjects, teamSize } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { error: "Company description is required" },
        { status: 400 }
      );
    }

    const id = body.id || Math.random().toString(36).substring(2, 10);

    const profile: CompanyProfile = {
      id,
      name: name.trim(),
      description: description.trim(),
      capabilities: (capabilities || "").trim(),
      pastProjects: (pastProjects || "").trim(),
      teamSize: typeof teamSize === "number" ? teamSize : parseInt(teamSize) || 1,
      createdAt: new Date().toISOString(),
    };

    // If updating existing profile, preserve createdAt
    const existing = getProfile(id);
    if (existing) {
      profile.createdAt = existing.createdAt;
    }

    saveProfile(profile);

    return NextResponse.json({ profile }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
