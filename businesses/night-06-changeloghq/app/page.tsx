"use client";

import { useState, useEffect, useCallback } from "react";

interface ChangelogEntry {
  id: string;
  title: string;
  date: string;
  version: string;
  type: "feature" | "fix" | "improvement" | "breaking";
  description: string;
  details: string;
}

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  feature: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/40" },
  fix: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/40" },
  improvement: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/40" },
  breaking: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/40" },
};

const typeLabels: Record<string, string> = {
  feature: "Feature",
  fix: "Fix",
  improvement: "Improvement",
  breaking: "Breaking",
};

type EntryType = "feature" | "fix" | "improvement" | "breaking";

interface FormState {
  version: string;
  title: string;
  date: string;
  type: EntryType;
  description: string;
  details: string;
}

const defaultForm: FormState = {
  version: "",
  title: "",
  date: new Date().toISOString().split("T")[0],
  type: "feature",
  description: "",
  details: "",
};

export default function Home() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [filter, setFilter] = useState<string>("all");
  const [status, setStatus] = useState<string>("");

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/entries");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      console.error("Failed to fetch entries");
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setStatus(err.error || "Failed to create entry");
        return;
      }
      setForm(defaultForm);
      setStatus("Entry added!");
      fetchEntries();
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("Network error");
    }
  };

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  const exportMarkdown = () => {
    const lines = ["# Changelog\n"];
    for (const entry of filtered) {
      lines.push(`## [${entry.version}] - ${entry.date}\n`);
      lines.push(`### ${typeLabels[entry.type]}: ${entry.title}\n`);
      lines.push(`${entry.description}\n`);
      if (entry.details) {
        lines.push(`${entry.details}\n`);
      }
      lines.push("");
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CHANGELOG.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHTML = () => {
    const html = filtered
      .map(
        (entry) =>
          `<div class="changelog-entry">
  <h2>${entry.version} - ${entry.date}</h2>
  <span class="badge badge-${entry.type}">${typeLabels[entry.type]}</span>
  <h3>${entry.title}</h3>
  <p>${entry.description}</p>
  ${entry.details ? `<pre>${entry.details}</pre>` : ""}
</div>`
      )
      .join("\n\n");
    navigator.clipboard.writeText(html);
    setStatus("HTML copied to clipboard!");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cyan-500">ChangelogHQ</h1>
            <p className="text-sm text-gray-400">Generate beautiful product changelogs</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportMarkdown}
              className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20"
            >
              Export Markdown
            </button>
            <button
              onClick={copyHTML}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
            >
              Copy HTML
            </button>
          </div>
        </div>
      </header>

      {/* Status bar */}
      {status && (
        <div className="mx-auto max-w-7xl px-6 pt-3">
          <div
            className={`rounded-lg px-4 py-2 text-sm ${
              status.includes("error") || status.includes("Failed") || status.includes("required")
                ? "bg-red-500/20 text-red-400"
                : "bg-cyan-500/20 text-cyan-400"
            }`}
          >
            {status}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-2">
        {/* Left: Entry Form */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-200">New Changelog Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">Version</label>
                <input
                  type="text"
                  placeholder="v2.1.0"
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Title</label>
              <input
                type="text"
                placeholder="What changed?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Type</label>
              <div className="flex gap-2">
                {(["feature", "fix", "improvement", "breaking"] as const).map((t: "feature" | "fix" | "improvement" | "breaking") => {
                  const colors = typeColors[t];
                  const isSelected = form.type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                        isSelected
                          ? `${colors.bg} ${colors.text} ${colors.border}`
                          : "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-750"
                      }`}
                    >
                      {typeLabels[t]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Description</label>
              <input
                type="text"
                placeholder="Brief summary of the change"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Detailed Notes</label>
              <textarea
                placeholder="Bullet points, migration steps, etc."
                rows={4}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              Add Entry
            </button>
          </form>
        </div>

        {/* Right: Live Preview */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-200">Live Preview</h2>
            <div className="flex gap-1.5">
              {["all", "feature", "fix", "improvement", "breaking"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    filter === t
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                  }`}
                >
                  {t === "all" ? "All" : typeLabels[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 && (
              <p className="py-12 text-center text-sm text-gray-600">No entries to display.</p>
            )}
            {filtered.map((entry) => {
              const colors = typeColors[entry.type];
              return (
                <div
                  key={entry.id}
                  className="relative rounded-xl border border-gray-800 bg-gray-900 p-5 pl-8"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-3 top-6 h-2.5 w-2.5 rounded-full ${colors.bg} ring-2 ${colors.border}`}
                  />

                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs font-bold text-cyan-400">
                      {entry.version}
                    </span>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
                    >
                      {typeLabels[entry.type]}
                    </span>
                    <span className="text-xs text-gray-500">{entry.date}</span>
                  </div>

                  <h3 className="mb-1 text-sm font-semibold text-gray-100">{entry.title}</h3>
                  <p className="mb-2 text-sm text-gray-400">{entry.description}</p>

                  {entry.details && (
                    <pre className="whitespace-pre-wrap rounded-lg bg-gray-800/60 p-3 text-xs text-gray-400">
                      {entry.details}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
