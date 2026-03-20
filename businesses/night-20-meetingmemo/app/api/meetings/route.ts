import { NextRequest, NextResponse } from "next/server";
import {
  getAllMeetings,
  addMeeting,
  addSummary,
  getSummaryByMeetingId,
  isSeedSummarized,
  markSeedSummarized,
  Meeting,
} from "../store";
import { analyzeTranscript } from "../analyze";

function ensureSeedSummary() {
  if (!isSeedSummarized()) {
    const meetings = getAllMeetings();
    for (const meeting of meetings) {
      if (!getSummaryByMeetingId(meeting.id)) {
        const analysis = analyzeTranscript(meeting);
        addSummary({
          id: `summary-${meeting.id}`,
          meetingId: meeting.id,
          createdAt: new Date().toISOString(),
          ...analysis,
        });
      }
    }
    markSeedSummarized();
  }
}

export async function GET() {
  ensureSeedSummary();
  const meetings = getAllMeetings();
  const result = meetings.map((m) => ({
    ...m,
    summary: getSummaryByMeetingId(m.id),
  }));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  ensureSeedSummary();
  try {
    const body = await request.json();
    const { title, date, duration, participants, transcript } = body;

    if (!title || !transcript) {
      return NextResponse.json(
        { error: "Title and transcript are required" },
        { status: 400 }
      );
    }

    const id = `meeting-${Date.now()}`;
    const meeting: Meeting = {
      id,
      title: title || "Untitled Meeting",
      date: date || new Date().toISOString().split("T")[0],
      duration: duration || 0,
      participants: Array.isArray(participants)
        ? participants
        : typeof participants === "string"
        ? participants.split(",").map((p: string) => p.trim()).filter(Boolean)
        : [],
      transcript,
    };

    addMeeting(meeting);

    const analysis = analyzeTranscript(meeting);
    const summary = {
      id: `summary-${id}`,
      meetingId: id,
      createdAt: new Date().toISOString(),
      ...analysis,
    };
    addSummary(summary);

    return NextResponse.json({ meeting, summary }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
