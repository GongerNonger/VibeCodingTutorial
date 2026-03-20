import { NextRequest, NextResponse } from "next/server";
import { getCronById } from "../../store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const entry = getCronById(params.id);

  if (!entry) {
    return NextResponse.json({ error: "Cron not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
}
