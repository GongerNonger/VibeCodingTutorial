import { NextRequest, NextResponse } from "next/server";
import { getMeetingById, getSummaryByMeetingId } from "../../store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const meeting = getMeetingById(params.id);
  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }

  const summary = getSummaryByMeetingId(params.id);
  return NextResponse.json({ meeting, summary });
}
