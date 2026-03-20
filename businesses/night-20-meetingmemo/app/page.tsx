"use client";

import { useState, useEffect, useCallback } from "react";

interface ActionItem {
  text: string;
  assignee: string | null;
}

interface KeyTopic {
  topic: string;
  frequency: number;
}

interface ParticipantActivity {
  name: string;
  lines: number;
}

interface MeetingSummary {
  id: string;
  meetingId: string;
  summary: string;
  actionItems: ActionItem[];
  decisions: string[];
  keyTopics: KeyTopic[];
  followUps: string[];
  sentiment: "productive" | "neutral" | "unproductive";
  participantActivity: ParticipantActivity[];
  createdAt: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  transcript: string;
  summary?: MeetingSummary;
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const config: Record<string, { icon: string; color: string; label: string }> = {
    productive: { icon: "\u2713", color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Productive" },
    neutral: { icon: "\u2014", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Neutral" },
    unproductive: { icon: "\u2717", color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Unproductive" },
  };
  const c = config[sentiment] || config.neutral;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${c.color}`}>
      <span>{c.icon}</span> {c.label}
    </span>
  );
}

export default function Home() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [duration, setDuration] = useState("");
  const [participants, setParticipants] = useState("");
  const [transcript, setTranscript] = useState("");

  const fetchMeetings = useCallback(async () => {
    const res = await fetch("/api/meetings");
    const data = await res.json();
    setMeetings(data);
    if (data.length > 0 && !selectedMeeting) {
      setSelectedMeeting(data[0]);
    }
  }, [selectedMeeting]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !transcript.trim()) return;

    setLoading(true);
    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        date,
        duration: parseInt(duration) || 0,
        participants,
        transcript,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const newMeeting = { ...data.meeting, summary: data.summary };
      setMeetings((prev) => [newMeeting, ...prev]);
      setSelectedMeeting(newMeeting);
      setTitle("");
      setDate(new Date().toISOString().split("T")[0]);
      setDuration("");
      setParticipants("");
      setTranscript("");
      setShowForm(false);
    }
    setLoading(false);
  }

  async function handleExport() {
    if (!selectedMeeting) return;
    const res = await fetch(`/api/meetings/${selectedMeeting.id}/export`);
    const md = await res.text();
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const summary = selectedMeeting?.summary;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-500 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MeetingMemo</h1>
              <p className="text-xs text-gray-500">Meeting Notes Summarizer</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {showForm ? "Cancel" : "+ New Meeting"}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* New Meeting Form */}
        {showForm && (
          <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Analyze Meeting Transcript</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Meeting Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Q1 Planning Meeting"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="45"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Participants (comma-separated)</label>
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="Alice, Bob, Carol"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Meeting Transcript *</label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={"Alice: Let's start the meeting...\nBob: I think we should focus on..."}
                  rows={10}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 font-mono text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? "Analyzing..." : "Analyze Transcript"}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Meeting History Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Meeting History
            </h3>
            <div className="space-y-2">
              {meetings.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMeeting(m)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedMeeting?.id === m.id
                      ? "bg-rose-500/10 border-rose-500/30 text-white"
                      : "bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700"
                  }`}
                >
                  <div className="font-medium text-sm truncate">{m.title}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{m.date}</span>
                    <span>|</span>
                    <span>{m.participants.length} participants</span>
                  </div>
                </button>
              ))}
              {meetings.length === 0 && (
                <p className="text-sm text-gray-600 italic">No meetings yet. Create one above.</p>
              )}
            </div>
          </div>

          {/* Summary Dashboard */}
          <div className="lg:col-span-3">
            {selectedMeeting && summary ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedMeeting.title}</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                      <span>{selectedMeeting.date}</span>
                      {selectedMeeting.duration > 0 && <span>{selectedMeeting.duration} min</span>}
                      <SentimentBadge sentiment={summary.sentiment} />
                    </div>
                  </div>
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                  >
                    {copied ? "Copied!" : "Export Markdown"}
                  </button>
                </div>

                {/* TL;DR */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-2">
                    TL;DR
                  </h3>
                  <p className="text-gray-300">{summary.summary}</p>
                </div>

                {/* Action Items & Decisions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-3">
                      Action Items ({summary.actionItems.length})
                    </h3>
                    {summary.actionItems.length > 0 ? (
                      <ul className="space-y-2">
                        {summary.actionItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 w-4 h-4 border border-gray-600 rounded flex-shrink-0" />
                            <div>
                              <span className="text-gray-300 text-sm">{item.text}</span>
                              {item.assignee && (
                                <span className="ml-2 inline-block px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs rounded-full border border-rose-500/30">
                                  {item.assignee}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600 italic">No action items detected.</p>
                    )}
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-3">
                      Decisions Made ({summary.decisions.length})
                    </h3>
                    {summary.decisions.length > 0 ? (
                      <ul className="space-y-2">
                        {summary.decisions.map((d, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-400 mt-0.5 flex-shrink-0">&#x25CF;</span>
                            <span className="text-gray-300 text-sm">{d}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600 italic">No decisions detected.</p>
                    )}
                  </div>
                </div>

                {/* Key Topics & Follow-ups */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-3">
                      Key Topics
                    </h3>
                    {summary.keyTopics.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {summary.keyTopics.map((t, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                          >
                            {t.topic}
                            <span className="text-xs text-rose-400 font-medium">{t.frequency}x</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 italic">No key topics detected.</p>
                    )}
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-3">
                      Follow-ups
                    </h3>
                    {summary.followUps.length > 0 ? (
                      <ul className="space-y-2">
                        {summary.followUps.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-0.5 flex-shrink-0">&#x25B6;</span>
                            <span className="text-gray-300 text-sm">{f}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600 italic">No follow-ups detected.</p>
                    )}
                  </div>
                </div>

                {/* Participant Activity */}
                {summary.participantActivity.length > 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider mb-3">
                      Participant Activity
                    </h3>
                    <div className="space-y-2">
                      {summary.participantActivity.map((p, i) => {
                        const maxLines = Math.max(
                          ...summary.participantActivity.map((x) => x.lines)
                        );
                        const pct = (p.lines / maxLines) * 100;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-sm text-gray-300 w-24 truncate font-medium">
                              {p.name}
                            </span>
                            <div className="flex-1 bg-gray-800 rounded-full h-2.5">
                              <div
                                className="bg-rose-500 h-2.5 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-16 text-right">
                              {p.lines} lines
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-600">
                <div className="text-center">
                  <div className="text-4xl mb-3">&#x1F4DD;</div>
                  <p>Select a meeting or create a new one to see its summary.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Footer */}
        <div className="mt-12 border-t border-gray-800 pt-8 pb-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              MeetingMemo &mdash; $15/mo individual | $49/mo team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
