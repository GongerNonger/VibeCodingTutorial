"use client";

import { useState, useEffect, useCallback } from "react";

interface FieldBreakdown {
  field: string;
  value: string;
  meaning: string;
}

interface GenerateResult {
  expression: string;
  explanation: string;
  nextRuns: string[];
  breakdown: FieldBreakdown[];
}

interface CronEntry {
  id: string;
  expression: string;
  description: string;
  label: string;
  createdAt: string;
}

const PRESETS = [
  { label: "Every Minute", description: "every minute" },
  { label: "Every 5 Minutes", description: "every 5 minutes" },
  { label: "Every 15 Minutes", description: "every 15 minutes" },
  { label: "Hourly", description: "hourly" },
  { label: "Daily at Midnight", description: "daily at 12am" },
  { label: "Daily at 9 AM", description: "daily at 9am" },
  { label: "Every Weekday 8 AM", description: "every weekday at 8am" },
  { label: "Every Monday 9 AM", description: "every Monday at 9am" },
  { label: "First of Month", description: "first day of month" },
  { label: "Sunday Midnight", description: "weekly on Sunday at midnight" },
  { label: "Twice Daily 9&5", description: "twice a day at 9am and 5pm" },
  { label: "Biz Hours /15m", description: "every 15 minutes during business hours" },
];

const FIELD_NAMES = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [savedCrons, setSavedCrons] = useState<CronEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [manualFields, setManualFields] = useState(["*", "*", "*", "*", "*"]);
  const [saving, setSaving] = useState(false);

  const fetchSaved = useCallback(async () => {
    try {
      const res = await fetch("/api/crons");
      if (res.ok) {
        const data = await res.json();
        setSavedCrons(data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  // Sync manual fields when result changes
  useEffect(() => {
    if (result) {
      setManualFields(result.expression.split(" "));
    }
  }, [result]);

  const generate = async (desc: string) => {
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
    } catch {
      setError("Failed to generate cron expression");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) generate(input.trim());
  };

  const handlePreset = (description: string) => {
    setInput(description);
    generate(description);
  };

  const handleManualFieldChange = (index: number, value: string) => {
    const newFields = [...manualFields];
    newFields[index] = value || "*";
    setManualFields(newFields);
  };

  const applyManualFields = async () => {
    const expression = manualFields.join(" ");
    // Use a synthetic description to parse the manual expression
    // We'll display it directly since it's user-entered
    setResult({
      expression,
      explanation: `Manual expression: ${expression}`,
      nextRuns: [],
      breakdown: manualFields.map((val, i) => ({
        field: FIELD_NAMES[i],
        value: val,
        meaning: val === "*" ? `Every ${FIELD_NAMES[i].toLowerCase()}` : val,
      })),
    });

    // Try to get next runs by calling the API with the expression indirectly
    // We'll calculate next runs client-side isn't needed since we show what we have
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.expression);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const saveCron = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const res = await fetch("/api/crons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expression: result.expression,
          description: result.explanation,
          label: input || result.expression,
        }),
      });
      if (res.ok) {
        fetchSaved();
      }
    } catch {
      // ignore
    }
    setSaving(false);
  };

  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "less than a minute";
    if (diffMins < 60) return `in ${diffMins} minute${diffMins === 1 ? "" : "s"}`;
    const diffHours = Math.floor(diffMins / 60);
    const remainMins = diffMins % 60;
    if (diffHours < 24) {
      return remainMins > 0
        ? `in ${diffHours}h ${remainMins}m`
        : `in ${diffHours} hour${diffHours === 1 ? "" : "s"}`;
    }
    const diffDays = Math.floor(diffHours / 24);
    const remainHours = diffHours % 24;
    return remainHours > 0
      ? `in ${diffDays}d ${remainHours}h`
      : `in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-lime-500">Cron</span>Speak
        </h1>
        <p className="text-gray-400 text-lg">
          Describe a schedule in English, get a cron expression with visual
          timeline
        </p>
      </div>

      {/* Natural Language Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Try: "every 5 minutes", "daily at 9am", "every Monday at 3pm"'
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 text-lg"
          />
          <button
            type="submit"
            className="bg-lime-500 hover:bg-lime-400 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Generate
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-300">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6 mb-10">
          {/* Cron Expression Display */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 uppercase tracking-wider">
                Cron Expression
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={saveCron}
                  disabled={saving}
                  className="text-sm bg-lime-600 hover:bg-lime-500 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
            <div className="text-4xl font-mono font-bold text-lime-400 mb-3 tracking-wider">
              {result.expression}
            </div>
            <p className="text-gray-400">{result.explanation}</p>
          </div>

          {/* Field Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
              Field Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="pb-2 text-gray-400 font-medium">Field</th>
                    <th className="pb-2 text-gray-400 font-medium">Value</th>
                    <th className="pb-2 text-gray-400 font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-800/50 last:border-0"
                    >
                      <td className="py-2 text-gray-300">{row.field}</td>
                      <td className="py-2 font-mono text-lime-400">
                        {row.value}
                      </td>
                      <td className="py-2 text-gray-400">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Next 5 Runs */}
          {result.nextRuns.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                Next 5 Runs
              </h2>
              <div className="space-y-3">
                {result.nextRuns.map((run, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-gray-200">
                          {formatDateTime(run)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatRelativeTime(run)}
                        </div>
                      </div>
                    </div>
                    <div className="h-px flex-1 bg-gray-800 hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Cron Editor */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
          Manual Cron Editor
        </h2>
        <div className="grid grid-cols-5 gap-3 mb-4">
          {FIELD_NAMES.map((name, i) => (
            <div key={name}>
              <label className="block text-xs text-gray-500 mb-1 text-center">
                {name}
              </label>
              <input
                type="text"
                value={manualFields[i]}
                onChange={(e) => handleManualFieldChange(i, e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-center font-mono text-lime-400 focus:outline-none focus:border-lime-500"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-gray-400 text-sm">
            {manualFields.join(" ")}
          </span>
          <button
            onClick={applyManualFields}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded transition-colors text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-10">
        <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
          Quick Presets
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset.description)}
              className="bg-gray-900 border border-gray-800 hover:border-lime-500/50 hover:bg-gray-800 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors text-left"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Expressions Library */}
      <div className="mb-10">
        <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">
          Saved Expressions
        </h2>
        {savedCrons.length === 0 ? (
          <p className="text-gray-600 text-sm">No saved expressions yet.</p>
        ) : (
          <div className="space-y-2">
            {savedCrons.map((cron) => (
              <div
                key={cron.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-center justify-between hover:border-gray-700 transition-colors"
              >
                <div>
                  <span className="font-mono text-lime-400 mr-3">
                    {cron.expression}
                  </span>
                  <span className="text-gray-400 text-sm">{cron.label}</span>
                </div>
                <button
                  onClick={() => {
                    setInput(cron.description);
                    setManualFields(cron.expression.split(" "));
                    setResult({
                      expression: cron.expression,
                      explanation: cron.description,
                      nextRuns: [],
                      breakdown: cron.expression.split(" ").map((val, i) => ({
                        field: FIELD_NAMES[i],
                        value: val,
                        meaning: val === "*" ? `Every ${FIELD_NAMES[i].toLowerCase()}` : val,
                      })),
                    });
                  }}
                  className="text-sm text-gray-500 hover:text-lime-400 transition-colors"
                >
                  Load
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm py-8 border-t border-gray-900">
        <p>CronSpeak - Night 15 of 25 - Overnight Business Factory</p>
        <p className="mt-1">
          Free tier available. Upgrade to Pro ($5/mo) for monitoring integration.
        </p>
      </footer>
    </main>
  );
}
