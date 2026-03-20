import { Meeting, ActionItem, MeetingSummary } from "./store";

interface ParsedLine {
  speaker: string | null;
  text: string;
}

function parseTranscriptLines(transcript: string): ParsedLine[] {
  const lines = transcript.split("\n").filter((l) => l.trim().length > 0);
  return lines.map((line) => {
    const match = line.match(/^([\w\s]+?\d*):\s*(.+)$/);
    if (match) {
      return { speaker: match[1].trim(), text: match[2].trim() };
    }
    return { speaker: null, text: line.trim() };
  });
}

function extractActionItems(lines: ParsedLine[]): ActionItem[] {
  const items: ActionItem[] = [];
  const actionPatterns = [
    /(\w+)\s+will\s+(.+)/i,
    /(\w+)\s+should\s+(.+)/i,
    /(\w+)\s+needs?\s+to\s+(.+)/i,
    /(\w+)\s+is going to\s+(.+)/i,
    /(\w+),?\s+can you\s+(.+)/i,
  ];
  const taskPatterns = [
    /(?:I'll|I will)\s+(.+)/i,
    /(?:let's|let us)\s+(.+)/i,
    /(?:we need to|we should)\s+(.+)/i,
  ];

  for (const line of lines) {
    const fullText = line.text;

    for (const pattern of actionPatterns) {
      const match = fullText.match(pattern);
      if (match) {
        const assignee = match[1];
        const skipWords = ["we", "they", "it", "this", "that", "the", "everyone", "somebody"];
        if (!skipWords.includes(assignee.toLowerCase())) {
          items.push({
            text: fullText,
            assignee: assignee,
          });
          break;
        }
      }
    }

    for (const pattern of taskPatterns) {
      const match = fullText.match(pattern);
      if (match && !items.find((i) => i.text === fullText)) {
        items.push({
          text: fullText,
          assignee: line.speaker,
        });
        break;
      }
    }
  }

  return items;
}

function extractDecisions(lines: ParsedLine[]): string[] {
  const decisions: string[] = [];
  const decisionKeywords = [
    "decided",
    "agreed",
    "will go with",
    "let's go with",
    "we'll go with",
    "decision is",
    "plan is to",
    "prioritize",
    "push that to",
  ];

  for (const line of lines) {
    const lower = line.text.toLowerCase();
    for (const keyword of decisionKeywords) {
      if (lower.includes(keyword)) {
        decisions.push(line.text);
        break;
      }
    }
  }

  return decisions;
}

function extractKeyTopics(lines: ParsedLine[]): { topic: string; frequency: number }[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "can", "shall", "i", "you", "he",
    "she", "it", "we", "they", "me", "him", "her", "us", "them", "my",
    "your", "his", "its", "our", "their", "this", "that", "these", "those",
    "what", "which", "who", "whom", "how", "when", "where", "why", "not",
    "no", "yes", "so", "if", "then", "than", "too", "very", "just",
    "about", "up", "out", "some", "also", "think", "good", "get", "one",
    "don't", "let's", "going", "done", "right", "yeah", "okay", "ok",
    "thanks", "sounds", "see", "next", "like", "more", "been", "much",
    "enough", "well", "here", "there", "back", "all", "any", "each",
  ]);

  const wordFreq: Record<string, number> = {};
  const bigramFreq: Record<string, number> = {};

  for (const line of lines) {
    const words = line.text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }

    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    }
  }

  // Combine bigrams and single words, preferring bigrams
  const topics: { topic: string; frequency: number }[] = [];

  const sortedBigrams = Object.entries(bigramFreq)
    .filter(([, freq]) => freq >= 2)
    .sort((a, b) => b[1] - a[1]);

  for (const [bigram, freq] of sortedBigrams.slice(0, 5)) {
    topics.push({ topic: bigram, frequency: freq });
  }

  const sortedWords = Object.entries(wordFreq)
    .filter(([, freq]) => freq >= 2)
    .sort((a, b) => b[1] - a[1]);

  for (const [word, freq] of sortedWords.slice(0, 10)) {
    if (!topics.some((t) => t.topic.includes(word))) {
      topics.push({ topic: word, frequency: freq });
    }
  }

  return topics.sort((a, b) => b.frequency - a.frequency).slice(0, 8);
}

function extractFollowUps(lines: ParsedLine[]): string[] {
  const followUps: string[] = [];
  const followUpKeywords = [
    "follow up",
    "follow-up",
    "next week",
    "next meeting",
    "check in",
    "check-in",
    "revisit",
    "circle back",
    "by monday",
    "by tuesday",
    "by wednesday",
    "by thursday",
    "by friday",
    "share it",
    "share with",
    "ready for review",
    "let's discuss",
  ];

  for (const line of lines) {
    const lower = line.text.toLowerCase();
    for (const keyword of followUpKeywords) {
      if (lower.includes(keyword)) {
        followUps.push(line.text);
        break;
      }
    }
  }

  return followUps;
}

function analyzeSentiment(lines: ParsedLine[]): "productive" | "neutral" | "unproductive" {
  const positiveWords = [
    "great", "good", "perfect", "agreed", "productive", "progress",
    "done", "finished", "completed", "thanks", "excellent", "amazing",
    "resolved", "solved", "clear", "wonderful", "fantastic",
  ];
  const negativeWords = [
    "problem", "issue", "stuck", "blocked", "confused", "unclear",
    "delay", "delayed", "failed", "failure", "waste", "unproductive",
    "frustrating", "disappointed", "concern", "risk", "behind",
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  for (const line of lines) {
    const lower = line.text.toLowerCase();
    for (const word of positiveWords) {
      if (lower.includes(word)) positiveCount++;
    }
    for (const word of negativeWords) {
      if (lower.includes(word)) negativeCount++;
    }
  }

  const total = positiveCount + negativeCount;
  if (total === 0) return "neutral";
  const ratio = positiveCount / total;
  if (ratio >= 0.6) return "productive";
  if (ratio <= 0.4) return "unproductive";
  return "neutral";
}

function getParticipantActivity(lines: ParsedLine[]): { name: string; lines: number }[] {
  const activity: Record<string, number> = {};

  for (const line of lines) {
    if (line.speaker) {
      activity[line.speaker] = (activity[line.speaker] || 0) + 1;
    }
  }

  return Object.entries(activity)
    .map(([name, lines]) => ({ name, lines }))
    .sort((a, b) => b.lines - a.lines);
}

function generateSummaryText(
  lines: ParsedLine[],
  decisions: string[],
  actionItems: ActionItem[],
  topics: { topic: string; frequency: number }[]
): string {
  const topTopics = topics.slice(0, 3).map((t) => t.topic);
  const numDecisions = decisions.length;
  const numActions = actionItems.length;

  const parts: string[] = [];
  if (topTopics.length > 0) {
    parts.push(`The meeting covered ${topTopics.join(", ")}`);
  }
  if (numDecisions > 0) {
    parts.push(`${numDecisions} decision${numDecisions > 1 ? "s were" : " was"} made`);
  }
  if (numActions > 0) {
    parts.push(`${numActions} action item${numActions > 1 ? "s were" : " was"} identified`);
  }

  if (parts.length === 0) {
    return "Meeting transcript analyzed. No major topics, decisions, or action items were identified.";
  }

  return parts.join(". ") + ".";
}

export function analyzeTranscript(meeting: Meeting): Omit<MeetingSummary, "id" | "meetingId" | "createdAt"> {
  const lines = parseTranscriptLines(meeting.transcript);
  const actionItems = extractActionItems(lines);
  const decisions = extractDecisions(lines);
  const keyTopics = extractKeyTopics(lines);
  const followUps = extractFollowUps(lines);
  const sentiment = analyzeSentiment(lines);
  const participantActivity = getParticipantActivity(lines);
  const summary = generateSummaryText(lines, decisions, actionItems, keyTopics);

  return {
    summary,
    actionItems,
    decisions,
    keyTopics,
    followUps,
    sentiment,
    participantActivity,
  };
}

export function formatAsMarkdown(meeting: Meeting, summary: MeetingSummary): string {
  let md = `# ${meeting.title}\n\n`;
  md += `**Date:** ${meeting.date}  \n`;
  md += `**Duration:** ${meeting.duration} minutes  \n`;
  md += `**Participants:** ${meeting.participants.join(", ")}  \n`;
  md += `**Sentiment:** ${summary.sentiment}  \n\n`;

  md += `## Summary\n\n${summary.summary}\n\n`;

  if (summary.actionItems.length > 0) {
    md += `## Action Items\n\n`;
    for (const item of summary.actionItems) {
      const assignee = item.assignee ? ` [@${item.assignee}]` : "";
      md += `- [ ] ${item.text}${assignee}\n`;
    }
    md += "\n";
  }

  if (summary.decisions.length > 0) {
    md += `## Decisions\n\n`;
    for (const decision of summary.decisions) {
      md += `- ${decision}\n`;
    }
    md += "\n";
  }

  if (summary.keyTopics.length > 0) {
    md += `## Key Topics\n\n`;
    for (const topic of summary.keyTopics) {
      md += `- **${topic.topic}** (mentioned ${topic.frequency}x)\n`;
    }
    md += "\n";
  }

  if (summary.followUps.length > 0) {
    md += `## Follow-ups\n\n`;
    for (const followUp of summary.followUps) {
      md += `- ${followUp}\n`;
    }
    md += "\n";
  }

  if (summary.participantActivity.length > 0) {
    md += `## Participant Activity\n\n`;
    for (const p of summary.participantActivity) {
      md += `- **${p.name}:** ${p.lines} contributions\n`;
    }
    md += "\n";
  }

  return md;
}
