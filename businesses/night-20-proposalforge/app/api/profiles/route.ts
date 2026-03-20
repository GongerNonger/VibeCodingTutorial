import { NextRequest, NextResponse } from "next/server";
import { getProfiles, saveProfile } from "@/lib/store";
import { FreelancerProfile } from "@/lib/types";

export async function GET() {
  const profiles = getProfiles();
  return NextResponse.json({ profiles });
}

export async function POST(req: NextRequest) {
  try {
    const body: Omit<FreelancerProfile, "id" | "createdAt"> = await req.json();

    if (!body.name || !body.title) {
      return NextResponse.json(
        { error: "Name and title are required" },
        { status: 400 }
      );
    }

    const profile: FreelancerProfile = {
      ...body,
      id: "prof_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      skills: body.skills || [],
      hourlyRate: body.hourlyRate || 0,
      portfolioUrl: body.portfolioUrl || "",
      email: body.email || "",
      createdAt: new Date().toISOString(),
    };

    saveProfile(profile);

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
