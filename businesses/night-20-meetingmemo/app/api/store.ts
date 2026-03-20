export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  transcript: string;
}

export interface ActionItem {
  text: string;
  assignee: string | null;
}

export interface MeetingSummary {
  id: string;
  meetingId: string;
  summary: string;
  actionItems: ActionItem[];
  decisions: string[];
  keyTopics: { topic: string; frequency: number }[];
  followUps: string[];
  sentiment: "productive" | "neutral" | "unproductive";
  participantActivity: { name: string; lines: number }[];
  createdAt: string;
}

const meetings: Meeting[] = [];
const summaries: MeetingSummary[] = [];

export function getAllMeetings(): Meeting[] {
  return [...meetings];
}

export function getMeetingById(id: string): Meeting | undefined {
  return meetings.find((m) => m.id === id);
}

export function addMeeting(meeting: Meeting): void {
  meetings.push(meeting);
}

export function getSummaryByMeetingId(meetingId: string): MeetingSummary | undefined {
  return summaries.find((s) => s.meetingId === meetingId);
}

export function addSummary(summary: MeetingSummary): void {
  summaries.push(summary);
}

// Pre-seed sample data
const sampleMeeting: Meeting = {
  id: "sample-1",
  title: "Q1 Product Planning",
  date: "2026-03-15",
  duration: 45,
  participants: ["Alice", "Bob", "Carol"],
  transcript: `Alice: Good morning everyone. Let's kick off our Q1 product planning session.
Bob: Sounds good. I think we should focus on the mobile app redesign this quarter.
Alice: Agreed. The user feedback has been clear about that. Carol, what's the status on the backend migration?
Carol: We're about 60% done. I think we can finish by end of February if we get one more engineer.
Bob: I can help with that. I'll free up some time next week.
Alice: Perfect. So we've decided to prioritize the mobile redesign and continue the backend migration in parallel.
Carol: We should also discuss the new analytics dashboard. Customers have been requesting it.
Bob: Right. I think we agreed to push that to Q2 though, since we don't have bandwidth.
Alice: Yes, let's go with that plan. Bob, can you draft the mobile redesign spec by Friday?
Bob: Will do. I'll have it ready for review by Thursday actually.
Carol: I'll prepare the backend migration timeline and share it with the team by Monday.
Alice: Great. Let's follow up on progress next Wednesday. I think this was a very productive meeting.
Bob: Agreed. Thanks everyone.
Carol: Thanks, see you next week.`,
};

addMeeting(sampleMeeting);

// We'll generate the summary via the analyzer after it's imported
// This is done in the route handler on first load
let seeded = false;
export function isSeedSummarized(): boolean {
  return seeded;
}
export function markSeedSummarized(): void {
  seeded = true;
}
