import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../store";
import { getNextTask, getStats } from "../braindump";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const nextTask = getNextTask(session.tasks);
  const stats = getStats(session.tasks);

  return NextResponse.json({
    nextTask,
    stats,
    allTasks: session.tasks,
  });
}
