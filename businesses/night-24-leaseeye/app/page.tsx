"use client";

import { useState, useEffect } from "react";

interface LeaseAnalysis {
  id: string;
  leaseText: string;
  summary: string;
  keyTerms: { label: string; value: string; category: string }[];
  redFlags: { title: string; description: string; severity: "low" | "medium" | "high" }[];
  clauses: { category: string; original: string; plainEnglish: string }[];
  monthlyRent: string | null;
  securityDeposit: string | null;
  leaseDuration: string | null;
  moveInDate: string | null;
  petPolicy: string | null;
  maintenanceResponsibilities: { landlord: string[]; tenant: string[] };
  terminationClause: string | null;
  riskScore: number;
  createdAt: string;
}

function RiskMeter({ score }: { score: number }) {
  const color = score > 60 ? "text-red-500" : score > 30 ? "text-yellow-500" : "text-green-500";
  const bgColor = score > 60 ? "bg-red-500" : score > 30 ? "bg-yellow-500" : "bg-green-500";
  const label = score > 60 ? "High Risk" : score > 30 ? "Moderate Risk" : "Low Risk";

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Risk Score</h3>
      <div className="flex items-end gap-3 mb-3">
        <span className={`text-5xl font-bold ${color}`}>{score}</span>
        <span className="text-gray-500 text-lg mb-1">/100</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
        <div className={`${bgColor} h-3 rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
      <p className={`text-sm font-medium ${color}`}>{label}</p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[severity] || colors.low}`}>
      {severity}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    financial: "bg-cyan-500/20 text-cyan-400",
    maintenance: "bg-orange-500/20 text-orange-400",
    rules: "bg-purple-500/20 text-purple-400",
    termination: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[category] || "bg-gray-700 text-gray-300"}`}>
      {category}
    </span>
  );
}

export default function Home() {
  const [leaseText, setLeaseText] = useState("");
  const [analysis, setAnalysis] = useState<LeaseAnalysis | null>(null);
  const [history, setHistory] = useState<LeaseAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"input" | "results">("input");

  useEffect(() => {
    fetch("/api/leases")
      .then((r) => r.json())
      .then((data) => setHistory(data))
      .catch(() => {});
  }, []);

  async function handleAnalyze() {
    if (!leaseText.trim()) {
      setError("Please paste your lease text first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaseText }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setAnalysis(data);
      setHistory((prev) => [data, ...prev]);
      setActiveTab("results");
    } catch {
      setError("Failed to analyze lease. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function loadAnalysis(a: LeaseAnalysis) {
    setAnalysis(a);
    setActiveTab("results");
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LeaseEye</h1>
              <p className="text-xs text-gray-500">Apartment Lease Analyzer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">$9/analysis or $19/mo</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("input")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "input" ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Analyze Lease
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "results" ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
            disabled={!analysis}
          >
            Results
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "input" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Paste your lease text below
                  </label>
                  <textarea
                    value={leaseText}
                    onChange={(e) => setLeaseText(e.target.value)}
                    placeholder="Paste your entire lease agreement here... We'll analyze it for key terms, red flags, and important clauses."
                    className="w-full h-80 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-y text-sm leading-relaxed"
                  />
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Analyze Lease
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === "results" && analysis && (
              <div className="space-y-6">
                {/* Risk Score + Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RiskMeter score={analysis.riskScore} />
                  <div className="md:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Summary</h3>
                    <p className="text-gray-200 leading-relaxed">{analysis.summary}</p>
                  </div>
                </div>

                {/* Key Terms */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Key Terms</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {analysis.keyTerms.map((term, i) => (
                      <div key={i} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                        <p className="text-xs text-gray-500 mb-1">{term.label}</p>
                        <p className="text-cyan-400 font-medium">{term.value}</p>
                      </div>
                    ))}
                    {analysis.keyTerms.length === 0 && (
                      <p className="text-gray-500 text-sm col-span-full">No key terms extracted. Try providing more detailed lease text.</p>
                    )}
                  </div>
                </div>

                {/* Red Flags */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Red Flags ({analysis.redFlags.length})
                  </h3>
                  {analysis.redFlags.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.redFlags.map((flag, i) => (
                        <div key={i} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 flex items-start gap-3">
                          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white font-medium text-sm">{flag.title}</p>
                              <SeverityBadge severity={flag.severity} />
                            </div>
                            <p className="text-gray-400 text-sm">{flag.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-green-400 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      No red flags detected
                    </p>
                  )}
                </div>

                {/* Clause Breakdown */}
                {analysis.clauses.length > 0 && (
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Clause Breakdown</h3>
                    <div className="space-y-3">
                      {analysis.clauses.map((clause, i) => (
                        <div key={i} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex items-center gap-2 mb-2">
                            <CategoryBadge category={clause.category} />
                          </div>
                          <p className="text-gray-500 text-xs mb-1 line-clamp-1">{clause.original}</p>
                          <p className="text-gray-200 text-sm">{clause.plainEnglish}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Maintenance Responsibilities */}
                {(analysis.maintenanceResponsibilities.landlord.length > 0 ||
                  analysis.maintenanceResponsibilities.tenant.length > 0) && (
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Maintenance Responsibilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <p className="text-xs text-cyan-400 font-medium mb-2 uppercase tracking-wide">Landlord</p>
                        <ul className="space-y-1">
                          {analysis.maintenanceResponsibilities.landlord.map((item, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                          {analysis.maintenanceResponsibilities.landlord.length === 0 && (
                            <li className="text-gray-600 text-sm">Not specified</li>
                          )}
                        </ul>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <p className="text-xs text-orange-400 font-medium mb-2 uppercase tracking-wide">Tenant</p>
                        <ul className="space-y-1">
                          {analysis.maintenanceResponsibilities.tenant.map((item, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                          {analysis.maintenanceResponsibilities.tenant.length === 0 && (
                            <li className="text-gray-600 text-sm">Not specified</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setActiveTab("input");
                    setLeaseText("");
                    setAnalysis(null);
                  }}
                  className="text-cyan-500 hover:text-cyan-400 text-sm font-medium transition-colors"
                >
                  Analyze Another Lease
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - History */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 sticky top-24">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Analysis History</h3>
              {history.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => loadAnalysis(a)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        analysis?.id === a.id
                          ? "bg-cyan-500/10 border-cyan-500/30"
                          : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-medium ${
                            a.riskScore > 60 ? "text-red-400" : a.riskScore > 30 ? "text-yellow-400" : "text-green-400"
                          }`}
                        >
                          Risk: {a.riskScore}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {a.monthlyRent ? `${a.monthlyRent}/mo` : ""}
                        {a.monthlyRent && a.leaseDuration ? " - " : ""}
                        {a.leaseDuration || ""}
                        {!a.monthlyRent && !a.leaseDuration ? a.leaseText.substring(0, 60) + "..." : ""}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No analyses yet. Paste a lease to get started.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
