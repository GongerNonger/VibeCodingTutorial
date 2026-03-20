import { analyzeTranscript, formatAsMarkdown } from "./app/api/analyze";
import { Meeting, MeetingSummary } from "./app/api/store";

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

console.log("\nMeetingMemo Test Suite\n");

// Test 1: Transcript parsing and action item extraction
console.log("Test 1: Action item extraction");
{
  const meeting: Meeting = {
    id: "t1",
    title: "Test",
    date: "2026-03-20",
    duration: 30,
    participants: ["Alice", "Bob"],
    transcript: `Alice: Bob will prepare the report by Friday.
Bob: I'll send the updated slides to everyone.
Alice: Let's schedule a follow-up next week.`,
  };
  const result = analyzeTranscript(meeting);
  assert(result.actionItems.length >= 2, `Found ${result.actionItems.length} action items (expected >= 2)`);
  const bobAction = result.actionItems.find((a) => a.assignee === "Bob");
  assert(bobAction !== undefined, "Bob identified as assignee for action item");
}

// Test 2: Decision detection
console.log("\nTest 2: Decision detection");
{
  const meeting: Meeting = {
    id: "t2",
    title: "Test",
    date: "2026-03-20",
    duration: 30,
    participants: ["Alice", "Bob"],
    transcript: `Alice: We decided to use React for the frontend.
Bob: Agreed, and let's go with PostgreSQL for the database.
Alice: The plan is to launch in Q2.`,
  };
  const result = analyzeTranscript(meeting);
  assert(result.decisions.length >= 2, `Found ${result.decisions.length} decisions (expected >= 2)`);
  const reactDecision = result.decisions.some((d) => d.toLowerCase().includes("react"));
  assert(reactDecision, "React decision detected");
}

// Test 3: Participant identification and activity
console.log("\nTest 3: Participant identification");
{
  const meeting: Meeting = {
    id: "t3",
    title: "Test",
    date: "2026-03-20",
    duration: 30,
    participants: ["Alice", "Bob", "Carol"],
    transcript: `Alice: Hello everyone.
Bob: Hi there.
Alice: Let's start.
Carol: Sure.
Alice: Great, let's go.
Bob: Sounds good.`,
  };
  const result = analyzeTranscript(meeting);
  assert(result.participantActivity.length === 3, `Found ${result.participantActivity.length} participants (expected 3)`);
  const alice = result.participantActivity.find((p) => p.name === "Alice");
  assert(alice !== undefined && alice.lines === 3, `Alice has ${alice?.lines} lines (expected 3)`);
}

// Test 4: Sentiment analysis
console.log("\nTest 4: Sentiment analysis");
{
  const productiveMeeting: Meeting = {
    id: "t4a",
    title: "Test",
    date: "2026-03-20",
    duration: 30,
    participants: ["Alice"],
    transcript: `Alice: This was a great meeting, very productive.
Alice: We resolved all the issues and made excellent progress.
Alice: Thanks everyone, wonderful work.`,
  };
  const productiveResult = analyzeTranscript(productiveMeeting);
  assert(productiveResult.sentiment === "productive", `Productive sentiment: got "${productiveResult.sentiment}"`);

  const unproductiveMeeting: Meeting = {
    id: "t4b",
    title: "Test",
    date: "2026-03-20",
    duration: 30,
    participants: ["Alice"],
    transcript: `Alice: We're stuck on this problem and it's frustrating.
Alice: The deployment failed again and we're behind schedule.
Alice: There's a risk this issue could cause further delays.`,
  };
  const unproductiveResult = analyzeTranscript(unproductiveMeeting);
  assert(unproductiveResult.sentiment === "unproductive", `Unproductive sentiment: got "${unproductiveResult.sentiment}"`);
}

// Test 5: Key topic extraction
console.log("\nTest 5: Key topic extraction");
{
  const meeting: Meeting = {
    id: "t5",
    title: "Test",
    date: "2026-03-20",
    duration: 30,
    participants: ["Alice", "Bob"],
    transcript: `Alice: The mobile app needs a redesign. The mobile app performance is poor.
Bob: The mobile app redesign should be our priority.
Alice: The backend migration is also important. Backend migration is ongoing.
Bob: Let's focus on mobile app first, then backend migration.`,
  };
  const result = analyzeTranscript(meeting);
  assert(result.keyTopics.length >= 2, `Found ${result.keyTopics.length} key topics (expected >= 2)`);
  const hasMobile = result.keyTopics.some((t) => t.topic.includes("mobile"));
  assert(hasMobile, "Mobile detected as a key topic");
}

// Test 6: Export as formatted markdown
console.log("\nTest 6: Export formatting");
{
  const meeting: Meeting = {
    id: "t6",
    title: "Sprint Retro",
    date: "2026-03-20",
    duration: 30,
    participants: ["Alice", "Bob"],
    transcript: `Alice: Bob will fix the login bug.
Bob: Agreed, I'll handle it by Monday.`,
  };
  const analysis = analyzeTranscript(meeting);
  const summary: MeetingSummary = {
    id: "s6",
    meetingId: "t6",
    createdAt: new Date().toISOString(),
    ...analysis,
  };
  const md = formatAsMarkdown(meeting, summary);
  assert(md.includes("# Sprint Retro"), "Markdown contains title");
  assert(md.includes("**Date:** 2026-03-20"), "Markdown contains date");
  assert(md.includes("## Action Items"), "Markdown contains action items section");
  assert(md.includes("Alice, Bob"), "Markdown contains participants");
}

// Test 7: Follow-up extraction
console.log("\nTest 7: Follow-up extraction");
{
  const meeting: Meeting = {
    id: "t7",
    title: "Test",
    date: "2026-03-20",
    duration: 30,
    participants: ["Alice", "Bob"],
    transcript: `Alice: Let's follow up next week on the progress.
Bob: I'll share it with the team by Friday.
Alice: We should revisit this topic at the next meeting.`,
  };
  const result = analyzeTranscript(meeting);
  assert(result.followUps.length >= 2, `Found ${result.followUps.length} follow-ups (expected >= 2)`);
}

console.log(`\n---\nResults: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
