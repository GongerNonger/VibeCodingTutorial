import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSessionTasks } from "../../store";
import { completeTask, skipTask, getNextTask, getStats, generateCelebration } from "../../braindump";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { sessionId, action } = await request.json();

  if (!sessionId || !action) {
    return NextResponse.json({ error: "sessionId and action are required" }, { status: 400 });
  }

  if (action !== "complete" && action !== "skip") {
    return NextResponse.json({ error: "action must be 'complete' or 'skip'" }, { status: 400 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const taskId = params.id;
  let updatedTasks;

  if (action === "complete") {
    updatedTasks = completeTask(session.tasks, taskId);
  } else {
    updatedTasks = skipTask(session.tasks, taskId);
  }

  const updated = updateSessionTasks(sessionId, updatedTasks);
  if (!updated) {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }

  const nextTask = getNextTask(updatedTasks);
  const stats = getStats(updatedTasks);
  const celebration = action === "complete" ? generateCelebration(stats.completed) : undefined;

  return NextResponse.json({
    nextTask,
    stats,
    celebration,
    allTasks: updatedTasks,
  });
}
