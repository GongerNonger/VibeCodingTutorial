import { NextRequest, NextResponse } from "next/server";
import { getSpeech } from "../../store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const speech = getSpeech(id);
  if (!speech) {
    return NextResponse.json({ error: "Speech not found" }, { status: 404 });
  }
  return NextResponse.json(speech);
}
