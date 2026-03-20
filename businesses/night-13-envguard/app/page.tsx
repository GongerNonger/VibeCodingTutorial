"use client";

import { useState, useEffect, useCallback } from "react";

interface Finding {
  line: number;
  variable: string;
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  recommendation: string;
}

interface ScanSummary {
  id: string;
  projectName: string;
  fileType: string;
  createdAt: string;
  hasAnalysis: boolean;
  riskScore: number | null;
  findingsCount: number;
}

interface ScanDetail {
  id: string;
  projectName: string;
  fileType: string;
  fileContent: string;
  createdAt: string;
  analysis: {
    findings: Finding[];
    riskScore: number;
    stats: {
      totalVars: number;
      secretsFound: number;
      recommendationsCount: number;
    };
  } | null;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-blue-500 text-white",
};

const FILE_TYPES = [".env", ".yaml", ".yml", ".json", ".toml"];

function riskColor(score: number): string {
  if (score < 30) return "text-green-400";
  if (score < 60) return "text-yellow-400";
  return "text-red-400";
}

function riskBadgeBg(score: number): string {
  if (score < 30) return "bg-green-500/20 text-green-400 border-green-500/30";
  if (score < 60)
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-red-500/20 text-red-400 border-red-500/30";
}

export default function Home() {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanDetail | null>(null);
  const [projectName, setProjectName] = useState("");
  const [fileType, setFileType] = useState(".env");
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedFindings, setExpandedFindings] = useState<Set<number>>(
    new Set()
  );
  const [showTips, setShowTips] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const fetchScans = useCallback(async () => {
    const res = await fetch("/api/scans");
    const data = await res.json();
    setScans(data);
  }, []);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  async function handleSubmitScan(e: React.FormEvent) {
    e.preventDefault();
    if (!projectName.trim() || !fileContent.trim()) return;

    setLoading(true);
    try {
      // Create scan
      const createRes = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, fileContent, fileType }),
      });
      const scan = await createRes.json();

      // Analyze
      const analyzeRes = await fetch(`/api/scans/${scan.id}/analyze`, {
        method: "POST",
      });
      await analyzeRes.json();

      // Fetch the full scan
      const detailRes = await fetch(`/api/scans/${scan.id}`);
      const detail = await detailRes.json();

      setSelectedScan(detail);
      setExpandedFindings(new Set());
      await fetchScans();

      // Clear form
      setProjectName("");
      setFileContent("");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectScan(id: string) {
    const res = await fetch(`/api/scans/${id}`);
    const data = await res.json();
    setSelectedScan(data);
    setExpandedFindings(new Set());
  }

  function toggleFinding(index: number) {
    setExpandedFindings((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function exportReport() {
    if (!selectedScan?.analysis) return;
    const { analysis, projectName: name } = selectedScan;
    let md = `# EnvGuard Security Report\n\n`;
    md += `**Project:** ${name}\n`;
    md += `**File Type:** ${selectedScan.fileType}\n`;
    md += `**Date:** ${new Date(selectedScan.createdAt).toLocaleString()}\n`;
    md += `**Risk Score:** ${analysis.riskScore}/100\n\n`;
    md += `## Stats\n`;
    md += `- Total Variables: ${analysis.stats.totalVars}\n`;
    md += `- Secrets Found: ${analysis.stats.secretsFound}\n`;
    md += `- Recommendations: ${analysis.stats.recommendationsCount}\n\n`;
    md += `## Findings\n\n`;

    for (const f of analysis.findings) {
      md += `### [${f.severity.toUpperCase()}] Line ${f.line}: ${f.variable}\n`;
      md += `- **Issue:** ${f.issue}\n`;
      md += `- **Recommendation:** ${f.recommendation}\n\n`;
    }

    navigator.clipboard.writeText(md);
    setCopyMessage("Report copied to clipboard!");
    setTimeout(() => setCopyMessage(""), 3000);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-800 flex flex-col bg-gray-900/50">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-red-500 flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            EnvGuard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            .env File Security Scanner
          </p>
        </div>

        <div className="p-3 border-b border-gray-800">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Scan History
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {scans.length === 0 ? (
            <p className="text-gray-600 text-sm p-4">No scans yet.</p>
          ) : (
            scans.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectScan(s.id)}
                className={`w-full text-left p-3 border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors ${
                  selectedScan?.id === s.id ? "bg-gray-800/70" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200 truncate">
                    {s.projectName}
                  </span>
                  {s.riskScore !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${riskBadgeBg(s.riskScore)}`}
                    >
                      {s.riskScore}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{s.fileType}</span>
                  <span className="text-xs text-gray-600">
                    {s.findingsCount} findings
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => setShowTips(!showTips)}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            {showTips ? "Hide" : "Show"} Security Tips
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {selectedScan ? selectedScan.projectName : "New Scan"}
            </h2>
            {selectedScan && (
              <p className="text-xs text-gray-500">
                Scanned {new Date(selectedScan.createdAt).toLocaleString()}
              </p>
            )}
          </div>
          {selectedScan?.analysis && (
            <div className="flex items-center gap-3">
              {copyMessage && (
                <span className="text-xs text-green-400">{copyMessage}</span>
              )}
              <button
                onClick={exportReport}
                className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
              >
                Export Report
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Show tips panel */}
          {showTips && (
            <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <h3 className="text-sm font-semibold text-red-400 mb-3">
                Security Tips
              </h3>
              <ul className="text-xs text-gray-400 space-y-2">
                <li>
                  Never commit .env files to version control -- add them to
                  .gitignore
                </li>
                <li>
                  Use a secrets manager (AWS Secrets Manager, HashiCorp Vault,
                  1Password) for production secrets
                </li>
                <li>
                  Rotate all keys and tokens regularly (every 90 days minimum)
                </li>
                <li>
                  Use IAM roles and service accounts instead of long-lived API
                  keys
                </li>
                <li>
                  Apply the principle of least privilege -- give each key only
                  the permissions it needs
                </li>
                <li>
                  Use separate .env files per environment (dev, staging, prod)
                </li>
                <li>
                  Enable MFA on all accounts that have API keys or tokens
                </li>
                <li>
                  Monitor for leaked secrets using tools like GitGuardian or
                  TruffleHog
                </li>
              </ul>
            </div>
          )}

          {/* Scan form (shown when no scan is selected) */}
          {!selectedScan && (
            <form onSubmit={handleSubmitScan} className="max-w-3xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Project"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  File Type
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  {FILE_TYPES.map((ft) => (
                    <option key={ft} value={ft}>
                      {ft}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  File Contents
                </label>
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  placeholder={`Paste your ${fileType} file contents here...`}
                  rows={16}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-y"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? "Scanning..." : "Scan for Secrets"}
              </button>
            </form>
          )}

          {/* Scan results */}
          {selectedScan?.analysis && (
            <div className="space-y-6">
              {/* Risk Score Gauge */}
              <div className="flex items-center gap-8 p-6 bg-gray-900 border border-gray-800 rounded-lg">
                <div className="text-center">
                  <div
                    className={`text-5xl font-bold ${riskColor(selectedScan.analysis.riskScore)}`}
                  >
                    {selectedScan.analysis.riskScore}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Risk Score / 100
                  </div>
                  <div className="w-32 h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedScan.analysis.riskScore < 30
                          ? "bg-green-500"
                          : selectedScan.analysis.riskScore < 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${selectedScan.analysis.riskScore}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-200">
                      {selectedScan.analysis.stats.totalVars}
                    </div>
                    <div className="text-xs text-gray-500">Total Variables</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-red-400">
                      {selectedScan.analysis.stats.secretsFound}
                    </div>
                    <div className="text-xs text-gray-500">Issues Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-yellow-400">
                      {selectedScan.analysis.stats.recommendationsCount}
                    </div>
                    <div className="text-xs text-gray-500">
                      Recommendations
                    </div>
                  </div>
                </div>
              </div>

              {/* Findings list */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">
                  Findings ({selectedScan.analysis.findings.length})
                </h3>
                <div className="space-y-2">
                  {selectedScan.analysis.findings.map((f, i) => (
                    <div
                      key={i}
                      className="border border-gray-800 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFinding(i)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-900/50 transition-colors text-left"
                      >
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${SEVERITY_COLORS[f.severity]}`}
                        >
                          {f.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 font-mono shrink-0">
                          L{f.line}
                        </span>
                        <span className="text-sm font-mono text-red-300 shrink-0">
                          {f.variable}
                        </span>
                        <span className="text-sm text-gray-400 flex-1 truncate">
                          {f.issue}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ${expandedFindings.has(i) ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {expandedFindings.has(i) && (
                        <div className="px-4 pb-3 border-t border-gray-800 bg-gray-900/30">
                          <p className="text-sm text-gray-400 mt-2">
                            <span className="text-gray-500 font-medium">
                              Issue:{" "}
                            </span>
                            {f.issue}
                          </p>
                          <p className="text-sm text-green-400 mt-2">
                            <span className="text-gray-500 font-medium">
                              Recommendation:{" "}
                            </span>
                            {f.recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* New scan button */}
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
              >
                New Scan
              </button>
            </div>
          )}

          {/* Selected scan with no analysis */}
          {selectedScan && !selectedScan.analysis && (
            <div className="text-gray-500 text-center py-12">
              <p>This scan has not been analyzed yet.</p>
              <button
                onClick={() => setSelectedScan(null)}
                className="mt-4 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
              >
                New Scan
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
