import { parseBrainDump, getNextTask, completeTask, skipTask, getStats, generateCelebration } from "./app/api/braindump";
import { createSession, getSession, updateSessionTasks, getAllSessions, sessions } from "./app/api/store";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log("\n=== FocusFlow Tests ===\n");

// Test 1: Brain dump parsing
console.log("Test 1: Brain dump parsing");
{
  const tasks = parseBrainDump("Reply to emails\nGo to the gym\nBuy groceries");
  assert(tasks.length === 3, "Parses 3 tasks from 3 lines");
  assert(tasks[0].text.length > 0, "First task has text");
  assert(tasks[0].status === "pending", "Tasks start as pending");
  assert(tasks[0].id.startsWith("task-"), "Tasks have valid IDs");
  assert(tasks[0].priority >= 1 && tasks[0].priority <= 100, "Priority is 1-100");
  assert(tasks[0].encouragement.length > 0, "Tasks have encouragement");
}

// Test 2: Empty/whitespace handling
console.log("\nTest 2: Empty and whitespace handling");
{
  const empty = parseBrainDump("");
  assert(empty.length === 0, "Empty string returns empty array");

  const whitespace = parseBrainDump("   \n\n   ");
  assert(whitespace.length === 0, "Whitespace-only returns empty array");

  const withBullets = parseBrainDump("- Task A\n* Task B\n1. Task C\n2) Task D");
  assert(withBullets.length === 4, "Strips bullet/number prefixes");
  assert(withBullets[0].text === "Task A" || withBullets[0].text === "Task B" || withBullets[0].text === "Task C" || withBullets[0].text === "Task D", "Cleaned task text doesn't include prefix");
}

// Test 3: Urgency detection
console.log("\nTest 3: Urgency detection");
{
  const tasks = parseBrainDump(
    "Fix the bug ASAP!!!\nFinish report by eod\nPlan vacation this week\nSomeday organize the garage"
  );
  const urgencies = tasks.map((t) => ({ text: t.text, urgency: t.urgency }));

  const asap = urgencies.find((t) => t.text.includes("ASAP"));
  assert(asap?.urgency === "now", "ASAP detected as 'now'");

  const eod = urgencies.find((t) => t.text.includes("eod"));
  assert(eod?.urgency === "today", "EOD detected as 'today'");

  const thisWeek = urgencies.find((t) => t.text.includes("this week"));
  assert(thisWeek?.urgency === "soon", "This week detected as 'soon'");

  const someday = urgencies.find((t) => t.text.includes("Someday"));
  assert(someday?.urgency === "later", "Someday detected as 'later'");
}

// Test 4: Category detection
console.log("\nTest 4: Category detection");
{
  const tasks = parseBrainDump(
    "Send email to client about meeting\nGo to the gym for a workout\nPick up groceries at the store\nWrite a blog post draft"
  );
  const categories = tasks.map((t) => ({ text: t.text, category: t.category }));

  const work = categories.find((t) => t.text.includes("email") && t.text.includes("client"));
  assert(work?.category === "work", "Email + client detected as work");

  const health = categories.find((t) => t.text.includes("gym"));
  assert(health?.category === "health", "Gym detected as health");

  const errands = categories.find((t) => t.text.includes("groceries"));
  assert(errands?.category === "errands", "Groceries detected as errands");

  const creative = categories.find((t) => t.text.includes("blog"));
  assert(creative?.category === "creative", "Blog post detected as creative");
}

// Test 5: Effort detection
console.log("\nTest 5: Effort detection");
{
  const tasks = parseBrainDump(
    "Quick reply\nJust check the mail\nRedesign the entire homepage layout and navigation structure for better UX"
  );
  const efforts = tasks.map((t) => ({ text: t.text, effort: t.effort }));

  const quick = efforts.find((t) => t.text.includes("Quick"));
  assert(quick?.effort === "tiny", "Quick task is tiny effort");

  const just = efforts.find((t) => t.text.includes("Just"));
  assert(just?.effort === "tiny", "Just task is tiny effort");

  const redesign = efforts.find((t) => t.text.includes("Redesign"));
  assert(redesign?.effort === "large", "Large description is large effort");
}

// Test 6: Priority ordering (urgent tiny tasks first)
console.log("\nTest 6: Priority ordering");
{
  const tasks = parseBrainDump(
    "Someday organize photos\nQuick email reply ASAP\nBig report due this week");
  // The ASAP tiny task should be highest priority
  assert(tasks[0].text.includes("ASAP") || tasks[0].urgency === "now", "Most urgent task is first");
  const lastTask = tasks[tasks.length - 1];
  assert(lastTask.urgency === "later" || lastTask.urgency === "soon", "Least urgent task is last");
}

// Test 7: getNextTask
console.log("\nTest 7: getNextTask");
{
  const tasks = parseBrainDump("Task A\nTask B\nTask C");
  const next = getNextTask(tasks);
  assert(next !== null, "Returns a task");
  assert(next!.id === tasks[0].id, "Returns highest priority task");

  const allDone = tasks.map((t) => ({ ...t, status: "completed" as const }));
  const noneLeft = getNextTask(allDone);
  assert(noneLeft === null, "Returns null when all completed");
}

// Test 8: completeTask and skipTask
console.log("\nTest 8: completeTask and skipTask");
{
  const tasks = parseBrainDump("Task A\nTask B\nTask C");
  const completed = completeTask(tasks, tasks[0].id);
  assert(completed[0].status === "completed", "First task marked completed");
  assert(completed[0].completedAt !== undefined, "Completed task has timestamp");
  assert(completed[1].status === "pending", "Other tasks unchanged");

  const skipped = skipTask(tasks, tasks[1].id);
  assert(skipped[1].status === "skipped", "Second task marked skipped");
  assert(skipped[0].status === "pending", "Other tasks unchanged after skip");
}

// Test 9: getStats
console.log("\nTest 9: getStats");
{
  let tasks = parseBrainDump("Task A\nTask B\nTask C\nTask D");
  let stats = getStats(tasks);
  assert(stats.total === 4, "Total is 4");
  assert(stats.completed === 0, "None completed initially");
  assert(stats.pending === 4, "All pending initially");
  assert(stats.completionRate === 0, "0% completion rate initially");

  tasks = completeTask(tasks, tasks[0].id);
  tasks = completeTask(tasks, tasks[1].id);
  tasks = skipTask(tasks, tasks[2].id);
  stats = getStats(tasks);
  assert(stats.completed === 2, "2 completed");
  assert(stats.skipped === 1, "1 skipped");
  assert(stats.pending === 1, "1 pending");
  assert(stats.completionRate === 50, "50% completion rate");
  assert(stats.totalMinutesCompleted > 0, "Minutes completed is positive");
}

// Test 10: generateCelebration
console.log("\nTest 10: generateCelebration");
{
  const c1 = generateCelebration(1);
  assert(c1.includes("First"), "First completion has special message");

  const c3 = generateCelebration(3);
  assert(c3.includes("trick") || c3.includes("Three"), "Third has special message");

  const c5 = generateCelebration(5);
  assert(c5.includes("FIVE") || c5.includes("fire"), "Fifth has special message");

  const c10 = generateCelebration(10);
  assert(c10.includes("TEN") || c10.includes("legend"), "Tenth has special message");
}

// Test 11: Store operations
console.log("\nTest 11: Store operations");
{
  const initialCount = getAllSessions().length;
  assert(initialCount >= 1, "Store has pre-seeded session");

  const sample = getSession("sample-1");
  assert(sample !== undefined, "Can retrieve pre-seeded session");
  assert(sample?.tasks.length === 3, "Pre-seeded session has 3 tasks");

  const tasks = parseBrainDump("Test task 1\nTest task 2");
  const session = createSession("Test task 1\nTest task 2", tasks);
  assert(session.id.startsWith("session-"), "Session has valid ID");
  assert(session.tasks.length === 2, "Session has 2 tasks");
  assert(getAllSessions().length === initialCount + 1, "Session count increased");

  const retrieved = getSession(session.id);
  assert(retrieved?.brainDump === "Test task 1\nTest task 2", "Retrieved session has brain dump");

  const updated = updateSessionTasks(session.id, completeTask(tasks, tasks[0].id));
  assert(updated !== undefined, "Update returns session");
  assert(updated!.tasks[0].status === "completed", "Updated task is completed");
}

// Test 12: Semicolon-separated brain dump
console.log("\nTest 12: Semicolon-separated input");
{
  const tasks = parseBrainDump("Email boss; buy milk; call dentist");
  assert(tasks.length === 3, "Parses semicolon-separated tasks");
}

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) {
  process.exit(1);
}
