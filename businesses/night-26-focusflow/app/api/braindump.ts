export interface RawTask {
  text: string;
  urgency: "now" | "today" | "soon" | "later";
  effort: "tiny" | "small" | "medium" | "large";
  category: "work" | "personal" | "health" | "errands" | "creative";
}

export interface PrioritizedTask {
  id: string;
  text: string;
  urgency: "now" | "today" | "soon" | "later";
  effort: "tiny" | "small" | "medium" | "large";
  category: "work" | "personal" | "health" | "errands" | "creative";
  priority: number; // 1-100, higher = do first
  encouragement: string;
  estimatedMinutes: number;
  status: "pending" | "active" | "completed" | "skipped";
  completedAt?: number;
}

const URGENCY_WEIGHT: Record<string, number> = {
  now: 40,
  today: 30,
  soon: 15,
  later: 5,
};

const EFFORT_MINUTES: Record<string, number> = {
  tiny: 5,
  small: 15,
  medium: 30,
  large: 60,
};

const EFFORT_BONUS: Record<string, number> = {
  tiny: 20,
  small: 15,
  medium: 5,
  large: 0,
};

const ENCOURAGEMENTS = [
  "You've got this! Just start, and momentum will carry you.",
  "One small step. That's all it takes right now.",
  "Your future self will thank you for doing this.",
  "Focus mode: ON. Everything else can wait.",
  "This is the only thing that matters right now.",
  "You chose this task for a reason. Trust yourself.",
  "Tiny progress beats perfect planning every time.",
  "The hardest part is starting. You're already there.",
  "Breathe in, breathe out, and begin.",
  "You don't have to do everything. Just this one thing.",
  "Channel that energy into this one task. Let's go!",
  "Remember: done is better than perfect.",
  "You're not behind. You're right where you need to be.",
  "This task is completely within your ability.",
  "Lock in. You were made for moments like this.",
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  health: ["gym", "exercise", "workout", "doctor", "dentist", "medication", "med", "sleep", "walk", "run", "yoga", "therapy", "therapist", "appointment", "vitamin", "stretch", "water", "hydrate", "meal prep", "cook"],
  errands: ["grocery", "groceries", "bank", "post office", "mail", "package", "return", "pickup", "drop off", "laundry", "clean", "dishes", "vacuum", "trash", "oil change", "car", "pharmacy", "store"],
  work: ["email", "meeting", "report", "deadline", "presentation", "project", "client", "boss", "review", "code", "deploy", "ship", "sprint", "standup", "slack", "invoice", "proposal"],
  creative: ["write", "blog", "design", "draw", "paint", "music", "video", "photo", "journal", "brainstorm", "idea", "sketch", "prototype", "content"],
  personal: ["call mom", "call dad", "friend", "birthday", "gift", "plan", "organize", "budget", "finance", "read", "book", "learn", "course"],
};

function detectCategory(text: string): RawTask["category"] {
  const lower = text.toLowerCase();
  let bestCategory: RawTask["category"] = "personal";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as RawTask["category"];
    }
  }

  return bestCategory;
}

function detectUrgency(text: string): RawTask["urgency"] {
  const lower = text.toLowerCase();
  if (lower.includes("asap") || lower.includes("urgent") || lower.includes("right now") || lower.includes("immediately") || lower.includes("!!!")) return "now";
  if (lower.includes("today") || lower.includes("tonight") || lower.includes("this morning") || lower.includes("this afternoon") || lower.includes("by eod")) return "today";
  if (lower.includes("this week") || lower.includes("soon") || lower.includes("tomorrow") || lower.includes("next few days")) return "soon";
  if (lower.includes("someday") || lower.includes("eventually") || lower.includes("when i get to it") || lower.includes("no rush") || lower.includes("later")) return "later";
  return "today"; // default: assume it's on their mind = today
}

function detectEffort(text: string): RawTask["effort"] {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).length;

  // Explicit hints
  if (lower.includes("quick") || lower.includes("just") || lower.includes("simply")) return "tiny";
  if (lower.includes("big") || lower.includes("huge") || lower.includes("overhaul") || lower.includes("refactor") || lower.includes("redesign")) return "large";

  // Length-based heuristic: longer descriptions = bigger tasks
  if (words <= 4) return "small";
  if (words <= 8) return "medium";
  return "large";
}

let idCounter = 0;

export function parseBrainDump(rawText: string): PrioritizedTask[] {
  const lines = rawText
    .split(/[\n;]/)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return [];

  const tasks: PrioritizedTask[] = lines.map((line) => {
    const urgency = detectUrgency(line);
    const effort = detectEffort(line);
    const category = detectCategory(line);

    const priority =
      URGENCY_WEIGHT[urgency] +
      EFFORT_BONUS[effort] +
      Math.random() * 10; // slight randomness to break ties

    return {
      id: `task-${Date.now()}-${++idCounter}`,
      text: line,
      urgency,
      effort,
      category,
      priority: Math.round(priority * 10) / 10,
      encouragement: ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)],
      estimatedMinutes: EFFORT_MINUTES[effort],
      status: "pending" as const,
    };
  });

  // Sort by priority descending (highest first)
  tasks.sort((a, b) => b.priority - a.priority);

  // Renormalize priorities to 1-100 scale
  const maxP = tasks[0]?.priority || 1;
  const minP = tasks[tasks.length - 1]?.priority || 0;
  const range = maxP - minP || 1;
  tasks.forEach((task, i) => {
    task.priority = Math.round(((task.priority - minP) / range) * 99 + 1);
  });

  return tasks;
}

export function getNextTask(tasks: PrioritizedTask[]): PrioritizedTask | null {
  // Find the highest-priority pending task
  const pending = tasks
    .filter((t) => t.status === "pending")
    .sort((a, b) => b.priority - a.priority);

  return pending[0] || null;
}

export function completeTask(tasks: PrioritizedTask[], taskId: string): PrioritizedTask[] {
  return tasks.map((t) =>
    t.id === taskId
      ? { ...t, status: "completed" as const, completedAt: Date.now() }
      : t
  );
}

export function skipTask(tasks: PrioritizedTask[], taskId: string): PrioritizedTask[] {
  return tasks.map((t) =>
    t.id === taskId ? { ...t, status: "skipped" as const } : t
  );
}

export function getStats(tasks: PrioritizedTask[]) {
  const completed = tasks.filter((t) => t.status === "completed");
  const pending = tasks.filter((t) => t.status === "pending");
  const skipped = tasks.filter((t) => t.status === "skipped");
  const totalMinutesCompleted = completed.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return {
    total: tasks.length,
    completed: completed.length,
    pending: pending.length,
    skipped: skipped.length,
    completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
    totalMinutesCompleted,
    streak: getStreak(completed),
  };
}

function getStreak(completedTasks: PrioritizedTask[]): number {
  // Count consecutive completed tasks (how many in a row without skipping)
  return completedTasks.length;
}

export function generateCelebration(completedCount: number): string {
  if (completedCount === 1) return "First one down! You're in motion now.";
  if (completedCount === 2) return "Two done! You're building momentum.";
  if (completedCount === 3) return "Hat trick! Three tasks crushed.";
  if (completedCount === 5) return "FIVE! You're on fire today!";
  if (completedCount === 10) return "TEN TASKS! Absolute legend status.";
  if (completedCount % 5 === 0) return `${completedCount} tasks done! Unstoppable!`;
  return `${completedCount} done! Keep that streak going!`;
}
