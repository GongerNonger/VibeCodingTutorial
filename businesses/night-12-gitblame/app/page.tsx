"use client";

import { useState, useEffect, useCallback } from "react";

interface FocusArea {
  file: string;
  concern: string;
  priority: "high" | "medium" | "low";
}

interface DiffStats {
  filesChanged: number;
  additions: number;
  deletions: number;
}

interface Analysis {
  summary: string;
  riskLevel: "low" | "medium" | "high";
  focusAreas: FocusArea[];
  suggestions: string[];
  stats: DiffStats;
  analyzedAt: string;
}

interface Review {
  id: string;
  title: string;
  description: string;
  diffText: string;
  baseBranch: string;
  headBranch: string;
  analysis: Analysis | null;
  createdAt: string;
}

const riskColors = {
  low: { bg: "bg-green-900/50", text: "text-green-400", border: "border-green-500" },
  medium: { bg: "bg-yellow-900/50", text: "text-yellow-400", border: "border-yellow-500" },
  high: { bg: "bg-red-900/50", text: "text-red-400", border: "border-red-500" },
};

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/50",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/50",
};

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [baseBranch, setBaseBranch] = useState("main");
  const [headBranch, setHeadBranch] = useState("");
  const [diffText, setDiffText] = useState("");

  const fetchReviews = useCallback(async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, diffText, baseBranch, headBranch }),
    });
    const review = await res.json();
    setTitle("");
    setDescription("");
    setBaseBranch("main");
    setHeadBranch("");
    setDiffText("");
    setShowForm(false);
    await fetchReviews();
    setSelectedReview(review);
  };

  const handleAnalyze = async (id: string) => {
    setAnalyzing(true);
    const res = await fetch(`/api/reviews/${id}/analyze`, { method: "POST" });
    const updated = await res.json();
    setSelectedReview(updated);
    await fetchReviews();
    setAnalyzing(false);
  };

  const handleCopySummary = () => {
    if (!selectedReview?.analysis) return;
    const a = selectedReview.analysis;
    const text = [
      `## PR Review Summary: ${selectedReview.title}`,
      "",
      `**Risk Level:** ${a.riskLevel.toUpperCase()}`,
      "",
      `### Summary`,
      a.summary,
      "",
      `### Focus Areas`,
      ...a.focusAreas.map((f) => `- **${f.file}** (${f.priority}): ${f.concern}`),
      "",
      `### Suggestions`,
      ...a.suggestions.map((s) => `- ${s}`),
      "",
      `### Stats`,
      `- Files changed: ${a.stats.filesChanged}`,
      `- Additions: +${a.stats.additions}`,
      `- Deletions: -${a.stats.deletions}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectReview = async (id: string) => {
    const res = await fetch(`/api/reviews/${id}`);
    const data = await res.json();
    setSelectedReview(data);
    setShowForm(false);
  };

  const maxStat =
    selectedReview?.analysis
      ? Math.max(selectedReview.analysis.stats.additions, selectedReview.analysis.stats.deletions, 1)
      : 1;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-800 flex flex-col bg-gray-900/50">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h1 className="text-xl font-bold text-amber-500">GitBlame</h1>
          </div>
          <p className="text-xs text-gray-500 mb-3">PR Review Summary Bot</p>
          <button
            onClick={() => {
              setShowForm(true);
              setSelectedReview(null);
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            + New Review
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {reviews.map((review) => (
            <button
              key={review.id}
              onClick={() => selectReview(review.id)}
              className={`w-full text-left p-3 border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors ${
                selectedReview?.id === review.id ? "bg-gray-800/70 border-l-2 border-l-amber-500" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-200 truncate pr-2">{review.title}</span>
                {review.analysis && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      riskColors[review.analysis.riskLevel].bg
                    } ${riskColors[review.analysis.riskLevel].text}`}
                  >
                    {review.analysis.riskLevel}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {review.baseBranch} &larr; {review.headBranch}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {showForm ? (
          <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-amber-500">New PR Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">PR Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="e.g., Add user authentication flow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Brief description of the changes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Base Branch</label>
                  <input
                    type="text"
                    value={baseBranch}
                    onChange={(e) => setBaseBranch(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="main"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Head Branch</label>
                  <input
                    type="text"
                    value={headBranch}
                    onChange={(e) => setHeadBranch(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="feature/my-changes"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Diff Text *</label>
                <textarea
                  value={diffText}
                  onChange={(e) => setDiffText(e.target.value)}
                  required
                  rows={16}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 font-mono text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Paste your git diff output here..."
                />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Create Review
              </button>
            </form>
          </div>
        ) : selectedReview ? (
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-100">{selectedReview.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedReview.baseBranch} &larr; {selectedReview.headBranch} &middot;{" "}
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </p>
                {selectedReview.description && (
                  <p className="text-gray-400 mt-2">{selectedReview.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                {!selectedReview.analysis && (
                  <button
                    onClick={() => handleAnalyze(selectedReview.id)}
                    disabled={analyzing}
                    className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-gray-950 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {analyzing ? "Analyzing..." : "Analyze PR"}
                  </button>
                )}
                {selectedReview.analysis && (
                  <button
                    onClick={handleCopySummary}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-4 rounded-lg transition-colors border border-gray-700"
                  >
                    {copied ? "Copied!" : "Copy Summary"}
                  </button>
                )}
              </div>
            </div>

            {selectedReview.analysis ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Summary</h3>
                  <p className="text-gray-200 leading-relaxed">{selectedReview.analysis.summary}</p>
                </div>

                {/* Risk Level */}
                <div
                  className={`rounded-xl p-5 border ${
                    riskColors[selectedReview.analysis.riskLevel].border
                  } ${riskColors[selectedReview.analysis.riskLevel].bg}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        selectedReview.analysis.riskLevel === "low"
                          ? "bg-green-500"
                          : selectedReview.analysis.riskLevel === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Risk Level</h3>
                      <p
                        className={`text-lg font-bold ${
                          riskColors[selectedReview.analysis.riskLevel].text
                        }`}
                      >
                        {selectedReview.analysis.riskLevel.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Diff Stats Bar Chart */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Diff Stats</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-200">
                        {selectedReview.analysis.stats.filesChanged}
                      </div>
                      <div className="text-xs text-gray-500">Files Changed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        +{selectedReview.analysis.stats.additions}
                      </div>
                      <div className="text-xs text-gray-500">Additions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">
                        -{selectedReview.analysis.stats.deletions}
                      </div>
                      <div className="text-xs text-gray-500">Deletions</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-16">Added</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(selectedReview.analysis.stats.additions / maxStat) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-green-400 w-12 text-right">
                        +{selectedReview.analysis.stats.additions}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-16">Deleted</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(selectedReview.analysis.stats.deletions / maxStat) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-red-400 w-12 text-right">
                        -{selectedReview.analysis.stats.deletions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Focus Areas
                  </h3>
                  <div className="space-y-3">
                    {selectedReview.analysis.focusAreas.map((area, i) => (
                      <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-sm text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            {area.file}
                          </code>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                              priorityColors[area.priority]
                            }`}
                          >
                            {area.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{area.concern}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {selectedReview.analysis.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-amber-500 mt-0.5">&#x2192;</span>
                        <span className="text-sm text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">&#128269;</div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Ready for Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Click &quot;Analyze PR&quot; to generate a review summary with focus areas and suggestions.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="w-16 h-16 text-amber-500/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-500 mb-2">GitBlame</h2>
              <p className="text-gray-600">Select a review or create a new one to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
