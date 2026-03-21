import { PrioritizedTask } from "./braindump";

export interface Session {
  id: string;
  tasks: PrioritizedTask[];
  createdAt: number;
  brainDump: string;
}

const sessions: Map<string, Session> = new Map();

let sessionCounter = 0;

export function createSession(brainDump: string, tasks: PrioritizedTask[]): Session {
  const session: Session = {
    id: `session-${Date.now()}-${++sessionCounter}`,
    tasks,
    createdAt: Date.now(),
    brainDump,
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function updateSessionTasks(id: string, tasks: PrioritizedTask[]): Session | undefined {
  const session = sessions.get(id);
  if (!session) return undefined;
  session.tasks = tasks;
  sessions.set(id, session);
  return session;
}

export function getAllSessions(): Session[] {
  return Array.from(sessions.values()).sort((a, b) => b.createdAt - a.createdAt);
}

// Pre-seed a sample session
const sampleTasks: PrioritizedTask[] = [
  {
    id: "sample-task-1",
    text: "Reply to Sarah's email about the project deadline",
    urgency: "today",
    effort: "small",
    category: "work",
    priority: 85,
    encouragement: "One quick reply and it's off your plate!",
    estimatedMinutes: 15,
    status: "pending",
  },
  {
    id: "sample-task-2",
    text: "Pick up groceries for dinner",
    urgency: "today",
    effort: "small",
    category: "errands",
    priority: 70,
    encouragement: "A quick trip and you're set for the evening.",
    estimatedMinutes: 15,
    status: "pending",
  },
  {
    id: "sample-task-3",
    text: "Review the quarterly report draft",
    urgency: "soon",
    effort: "medium",
    category: "work",
    priority: 45,
    encouragement: "Deep breath. Just read through it once—you can do this.",
    estimatedMinutes: 30,
    status: "pending",
  },
];

const sampleSession: Session = {
  id: "sample-1",
  tasks: sampleTasks,
  createdAt: Date.now() - 3600000,
  brainDump: "Reply to Sarah's email about the project deadline\nPick up groceries for dinner\nReview the quarterly report draft",
};

sessions.set(sampleSession.id, sampleSession);

export { sessions };
