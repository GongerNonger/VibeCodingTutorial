import { NextRequest, NextResponse } from "next/server";
import { grants } from "@/lib/grants";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const grant = grants.find((g) => g.id === params.id);

  if (!grant) {
    return NextResponse.json({ error: "Grant not found" }, { status: 404 });
  }

  return NextResponse.json(grant);
}
