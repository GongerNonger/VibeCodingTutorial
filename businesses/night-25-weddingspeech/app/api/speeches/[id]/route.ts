import { NextRequest, NextResponse } from "next/server";
import { getSpeech } from "../../store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const speech = getSpeech(params.id);
  if (!speech) {
    return NextResponse.json({ error: "Speech not found" }, { status: 404 });
  }
  return NextResponse.json(speech);
}
