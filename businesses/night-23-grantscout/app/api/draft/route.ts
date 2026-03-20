import { NextRequest, NextResponse } from "next/server";
import { grants } from "@/lib/grants";
import { generateDraft } from "@/lib/drafter";
import { BusinessProfile } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { grantId, profile }: { grantId: string; profile: BusinessProfile } = body;

    if (!grantId || !profile) {
      return NextResponse.json(
        { error: "grantId and profile are required" },
        { status: 400 }
      );
    }

    const grant = grants.find((g) => g.id === grantId);
    if (!grant) {
      return NextResponse.json(
        { error: "Grant not found" },
        { status: 404 }
      );
    }

    const drafts = generateDraft(grant, profile);

    return NextResponse.json({
      grantId,
      grantName: grant.name,
      drafts,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
