import { NextRequest, NextResponse } from "next/server";
import { BusinessProfile } from "@/lib/engine";

const businesses: Map<string, BusinessProfile> = new Map();

export async function GET() {
  return NextResponse.json(Array.from(businesses.values()));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, personality } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const profile: BusinessProfile = {
      id,
      name,
      type: type || "general",
      personality: personality || "deliver excellent experiences",
    };

    businesses.set(id, profile);
    return NextResponse.json(profile, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
