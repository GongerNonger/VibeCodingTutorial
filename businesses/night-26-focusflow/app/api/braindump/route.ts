import { NextRequest, NextResponse } from "next/server";
import { parseBrainDump } from "../braindump";
import { createSession } from "../store";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "Brain dump text is required" }, { status: 400 });
  }

  const tasks = parseBrainDump(text.trim());
  if (tasks.length === 0) {
    return NextResponse.json({ error: "No tasks could be extracted" }, { status: 400 });
  }

  const session = createSession(text.trim(), tasks);

  return NextResponse.json(session);
}
