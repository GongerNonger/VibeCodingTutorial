"use client";

import { useState, useEffect, useCallback } from "react";

interface RegexPart {
  part: string;
  explanation: string;
}

interface GenerateResult {
  regex: string;
  flags: string;
  explanation: RegexPart[];
  exampleMatches: string[];
  exampleNonMatches: string[];
}

interface SavedPattern {
  id: string;
  description: string;
  regex: string;
  flags: string;
  testStrings: string[];
  createdAt: string;
}

interface MatchGroup {
  fullMatch: string;
  groups: string[];
  index: number;
}

const QUICK_PATTERNS = [
  { label: "Email", query: "email address" },
  { label: "Phone", query: "phone number" },
  { label: "URL", query: "URL" },
  { label: "IP Address", query: "IP address" },
  { label: "Date", query: "date YYYY-MM-DD" },
  { label: "Credit Card", query: "credit card number" },
  { label: "Hex Color", query: "hex color" },
  { label: "Password", query: "strong password" },
];

const REGEX_COLORS = [
  "text-cyan-400",
  "text-pink-400",
  "text-yellow-400",
  "text-green-400",
  "text-purple-400",
  "text-orange-400",
  "text-blue-400",
  "text-red-400",
  "text-teal-400",
  "text-indigo-400",
];

export default function Home() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>([]);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const loadPatterns = useCallback(async () => {
    try {
      const res = await fetch("/api/patterns");
      if (res.ok) {
        const data = await res.json();
        setSavedPatterns(data);
      }
    } catch {
      // Ignore errors loading patterns
    }
  }, []);

  useEffect(() => {
    loadPatterns();
  }, [loadPatterns]);

  const generateRegex = async (query?: string) => {
    const desc = query || description;
    if (!desc.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setResult(data);
      if (data.exampleMatches?.length > 0) {
        setTestInput(data.exampleMatches.join("\n"));
      }
    } catch {
      setError("Failed to generate regex. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      generateRegex();
    }
  };

  const copyRegex = () => {
    if (!result) return;
    const text = `/${result.regex}/${result.flags}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const saveCurrentPattern = async () => {
    if (!result) return;
    setSaveStatus("saving");

    try {
      const res = await fetch("/api/patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description || "Custom pattern",
          regex: result.regex,
          flags: result.flags,
          testStrings: testInput.split("\n").filter(Boolean),
        }),
      });

      if (res.ok) {
        setSaveStatus("saved");
        loadPatterns();
        setTimeout(() => setSaveStatus(""), 2000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus(""), 2000);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const loadSavedPattern = (pattern: SavedPattern) => {
    setDescription(pattern.description);
    setResult({
      regex: pattern.regex,
      flags: pattern.flags,
      explanation: [],
      exampleMatches: pattern.testStrings,
      exampleNonMatches: [],
    });
    setTestInput(pattern.testStrings.join("\n"));
    setSidebarOpen(false);
  };

  // Live regex testing
  const getMatchResults = (): { line: string; matches: boolean; groups: MatchGroup[] }[] => {
    if (!result || !testInput.trim()) return [];

    const lines = testInput.split("\n");
    return lines.map((line) => {
      if (!line.trim()) return { line, matches: false, groups: [] };

      try {
        const re = new RegExp(result.regex, result.flags);
        const match = re.exec(line);
        const matches = re.test(line);

        const groups: MatchGroup[] = [];
        if (match) {
          groups.push({
            fullMatch: match[0],
            groups: match.slice(1).filter((g) => g !== undefined),
            index: match.index,
          });
        }

        return { line, matches, groups };
      } catch {
        return { line, matches: false, groups: [] };
      }
    });
  };

  const matchResults = getMatchResults();

  const renderHighlightedRegex = (regex: string, explanation: RegexPart[]) => {
    if (explanation.length === 0) {
      return <span className="text-cyan-400 font-mono text-lg">{regex}</span>;
    }

    let remaining = regex;
    const parts: { text: string; colorIndex: number }[] = [];
    let colorIdx = 0;

    for (const exp of explanation) {
      const idx = remaining.indexOf(exp.part);
      if (idx > 0) {
        parts.push({ text: remaining.slice(0, idx), colorIndex: colorIdx++ });
      }
      if (idx >= 0) {
        parts.push({ text: exp.part, colorIndex: colorIdx++ });
        remaining = remaining.slice(idx + exp.part.length);
      }
    }
    if (remaining) {
      parts.push({ text: remaining, colorIndex: colorIdx++ });
    }

    return (
      <span className="font-mono text-lg">
        {parts.map((p, i) => (
          <span key={i} className={REGEX_COLORS[p.colorIndex % REGEX_COLORS.length]}>
            {p.text}
          </span>
        ))}
      </span>
    );
  };

  const highlightMatch = (line: string, groups: MatchGroup[]) => {
    if (groups.length === 0) return <span>{line}</span>;

    const { fullMatch, index } = groups[0];
    const before = line.slice(0, index);
    const after = line.slice(index + fullMatch.length);

    return (
      <span>
        {before}
        <span className="bg-cyan-500/30 text-cyan-300 rounded px-0.5">{fullMatch}</span>
        {after}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:${sidebarOpen ? "block" : "hidden"}`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-cyan-400">Saved Patterns</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {savedPatterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => loadSavedPattern(pattern)}
                className="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-750 hover:ring-1 hover:ring-cyan-500/50 transition-all"
              >
                <div className="text-sm font-medium text-gray-200">{pattern.description}</div>
                <div className="text-xs text-gray-500 font-mono mt-1 truncate">
                  /{pattern.regex}/{pattern.flags}
                </div>
              </button>
            ))}
            {savedPatterns.length === 0 && (
              <p className="text-gray-500 text-sm">No saved patterns yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                title="Saved Patterns"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-4xl font-bold">
                <span className="text-cyan-500">Regex</span>
                <span className="text-white">Genie</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Describe what you want to match in plain English
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Try: "email address", "phone number", "URL", "IP address"...'
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
              />
              <button
                onClick={() => generateRegex()}
                disabled={loading || !description.trim()}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? "..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Quick Patterns */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-2">Quick patterns:</p>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_PATTERNS.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => {
                    setDescription(qp.query);
                    generateRegex(qp.query);
                  }}
                  className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Regex Display */}
              <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Generated Regex
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={saveCurrentPattern}
                      className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                    >
                      {saveStatus === "saving"
                        ? "Saving..."
                        : saveStatus === "saved"
                        ? "Saved!"
                        : saveStatus === "error"
                        ? "Error"
                        : "Save Pattern"}
                    </button>
                    <button
                      onClick={copyRegex}
                      className="px-3 py-1.5 text-sm bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors"
                    >
                      {copied ? "Copied!" : "Copy Regex"}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-950 rounded-md p-4 overflow-x-auto">
                  <code>
                    <span className="text-gray-500">/</span>
                    {renderHighlightedRegex(result.regex, result.explanation)}
                    <span className="text-gray-500">/{result.flags}</span>
                  </code>
                </div>
              </div>

              {/* Explanation */}
              {result.explanation.length > 0 && (
                <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Pattern Breakdown
                  </h2>
                  <div className="space-y-2">
                    {result.explanation.map((exp, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <code
                          className={`${REGEX_COLORS[i % REGEX_COLORS.length]} font-mono text-sm bg-gray-950 px-2 py-1 rounded min-w-[120px] shrink-0`}
                        >
                          {exp.part}
                        </code>
                        <span className="text-gray-300 text-sm pt-1">{exp.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Test Area */}
              <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Live Test Area
                </h2>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter test strings (one per line)..."
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm resize-vertical mb-4"
                />

                {/* Match Results */}
                {matchResults.length > 0 && (
                  <div className="space-y-1">
                    <h3 className="text-sm text-gray-400 mb-2">Results:</h3>
                    {matchResults.map((mr, i) => {
                      if (!mr.line.trim()) return null;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 px-3 py-2 rounded font-mono text-sm ${
                            mr.matches
                              ? "bg-green-900/20 border border-green-800/30"
                              : "bg-red-900/20 border border-red-800/30"
                          }`}
                        >
                          <span
                            className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded ${
                              mr.matches
                                ? "bg-green-700 text-green-100"
                                : "bg-red-700 text-red-100"
                            }`}
                          >
                            {mr.matches ? "MATCH" : "NO MATCH"}
                          </span>
                          <span className="text-gray-200 truncate">
                            {highlightMatch(mr.line, mr.groups)}
                          </span>
                          {mr.groups.length > 0 && mr.groups[0].groups.length > 0 && (
                            <span className="text-xs text-gray-500 shrink-0">
                              Groups: {mr.groups[0].groups.map((g, j) => (
                                <span key={j} className="text-purple-400">
                                  {j > 0 ? ", " : ""}&quot;{g}&quot;
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Example Matches / Non-Matches */}
              {(result.exampleMatches.length > 0 || result.exampleNonMatches.length > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  {result.exampleMatches.length > 0 && (
                    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                      <h3 className="text-sm font-semibold text-green-400 mb-2">Example Matches</h3>
                      <ul className="space-y-1">
                        {result.exampleMatches.map((ex, i) => (
                          <li key={i} className="text-sm text-gray-300 font-mono">
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.exampleNonMatches.length > 0 && (
                    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                      <h3 className="text-sm font-semibold text-red-400 mb-2">Non-Matches</h3>
                      <ul className="space-y-1">
                        {result.exampleNonMatches.map((ex, i) => (
                          <li key={i} className="text-sm text-gray-300 font-mono">
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-600 text-sm">
              Free tier: unlimited generations | <span className="text-cyan-500">Pro $9/mo</span>: saved patterns &amp; API access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
