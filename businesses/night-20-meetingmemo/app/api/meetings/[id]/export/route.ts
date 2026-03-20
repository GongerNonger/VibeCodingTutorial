import { NextRequest, NextResponse } from "next/server";
import { getMeetingById, getSummaryByMeetingId } from "../../../store";
import { formatAsMarkdown } from "../../../analyze";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const meeting = getMeetingById(params.id);
  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }

  const summary = getSummaryByMeetingId(params.id);
  if (!summary) {
    return NextResponse.json({ error: "Summary not found" }, { status: 404 });
  }

  const markdown = formatAsMarkdown(meeting, summary);
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": `attachment; filename="${meeting.title.replace(/[^a-z0-9]/gi, "-")}-summary.md"`,
    },
  });
}
