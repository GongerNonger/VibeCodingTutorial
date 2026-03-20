"use client";

import { useState } from "react";

interface RFPSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

interface GeneratedResponse {
  sectionId: string;
  sectionTitle: string;
  response: string;
}

type Tone = "formal" | "persuasive" | "technical";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");
  const [capabilities, setCapabilities] = useState("");
  const [pastProjects, setPastProjects] = useState("");
  const [teamSize, setTeamSize] = useState("10");
  const [rfpText, setRfpText] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [sections, setSections] = useState<RFPSection[]>([]);
  const [responses, setResponses] = useState<GeneratedResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "review" | "results">("input");
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const saveProfile = async () => {
    if (!companyName.trim() || !companyDesc.trim()) {
      setError("Company name and description are required.");
      return;
    }
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName,
          description: companyDesc,
          capabilities,
          pastProjects,
          teamSize: parseInt(teamSize) || 1,
        }),
      });
      if (res.ok) {
        setProfileSaved(true);
        setError("");
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } catch {
      setError("Failed to save profile.");
    }
  };

  const analyzeRFP = async () => {
    if (!rfpText.trim()) {
      setError("Please paste your RFP text.");
      return;
    }
    if (!companyName.trim() || !companyDesc.trim()) {
      setError("Please fill in your company profile first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rfpText }),
      });
      const data = await res.json();
      if (data.sections && data.sections.length > 0) {
        setSections(data.sections);
        setStep("review");
      } else {
        setError("Could not parse any sections from the RFP text. Try adding clear section headings.");
      }
    } catch {
      setError("Failed to analyze the RFP.");
    } finally {
      setLoading(false);
    }
  };

  const generateResponses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections,
          profile: {
            id: "current",
            name: companyName,
            description: companyDesc,
            capabilities,
            pastProjects,
            teamSize: parseInt(teamSize) || 1,
            createdAt: new Date().toISOString(),
          },
          tone,
        }),
      });
      const data = await res.json();
      if (data.responses) {
        setResponses(data.responses);
        setStep("results");
      }
    } catch {
      setError("Failed to generate responses.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    const full = responses
      .map((r) => `## ${r.sectionTitle}\n\n${r.response}`)
      .join("\n\n---\n\n");
    await navigator.clipboard.writeText(full);
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => {
    setSections([]);
    setResponses([]);
    setStep("input");
    setRfpText("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              R
            </div>
            <h1 className="text-xl font-bold text-white">RFPReply</h1>
            <span className="text-xs text-gray-500 hidden sm:inline">AI RFP & Grant Response Writer</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className={`w-2 h-2 rounded-full ${step === "input" ? "bg-indigo-500" : "bg-gray-600"}`} />
            <span className={step === "input" ? "text-indigo-400" : ""}>Input</span>
            <span className="mx-1">/</span>
            <span className={`w-2 h-2 rounded-full ${step === "review" ? "bg-indigo-500" : "bg-gray-600"}`} />
            <span className={step === "review" ? "text-indigo-400" : ""}>Review</span>
            <span className="mx-1">/</span>
            <span className={`w-2 h-2 rounded-full ${step === "results" ? "bg-indigo-500" : "bg-gray-600"}`} />
            <span className={step === "results" ? "text-indigo-400" : ""}>Results</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Input */}
        {step === "input" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Company Profile */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Company Profile</h2>
                <button
                  onClick={saveProfile}
                  className="text-sm px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                >
                  {profileSaved ? "Saved!" : "Save Profile"}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Solutions Inc."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company Description *</label>
                <textarea
                  value={companyDesc}
                  onChange={(e) => setCompanyDesc(e.target.value)}
                  rows={3}
                  placeholder="We are a technology consulting firm specializing in..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Capabilities & Services</label>
                <textarea
                  value={capabilities}
                  onChange={(e) => setCapabilities(e.target.value)}
                  rows={3}
                  placeholder="Cloud migration, data analytics, custom software development..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Past Projects & Experience</label>
                <textarea
                  value={pastProjects}
                  onChange={(e) => setPastProjects(e.target.value)}
                  rows={3}
                  placeholder="Delivered enterprise CRM for Fortune 500 client, Migrated 50TB data warehouse..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Team Size</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  min="1"
                  className="w-32 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Response Tone</label>
                <div className="flex gap-2">
                  {(["formal", "persuasive", "technical"] as Tone[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        tone === t
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RFP Input */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">RFP / Grant Application Text</h2>
              <textarea
                value={rfpText}
                onChange={(e) => setRfpText(e.target.value)}
                rows={20}
                placeholder={`Paste your full RFP or grant application text here...\n\nExample:\n\nSection 1: Company Qualifications\nDescribe your company's relevant experience and qualifications.\n\nSection 2: Technical Approach\nProvide a detailed technical approach for the proposed solution.\n\nSection 3: Past Performance\nList three relevant past projects with references.`}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <button
                onClick={analyzeRFP}
                disabled={loading}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? "Analyzing..." : "Analyze RFP Sections"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review parsed sections */}
        {step === "review" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Parsed Sections ({sections.length})
              </h2>
              <button
                onClick={() => setStep("input")}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Back to Input
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((section, i) => (
                <div
                  key={section.id}
                  className="p-4 bg-gray-900 border border-gray-800 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white">
                      {i + 1}. {section.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        section.type === "question"
                          ? "bg-blue-900/50 text-blue-300"
                          : section.type === "requirement"
                          ? "bg-amber-900/50 text-amber-300"
                          : section.type === "criteria"
                          ? "bg-green-900/50 text-green-300"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {section.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={generateResponses}
                disabled={loading}
                className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? "Generating Responses..." : `Generate ${tone.charAt(0).toUpperCase() + tone.slice(1)} Responses`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === "results" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Generated Responses ({responses.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyAll}
                  className="text-sm px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                  {copied === "all" ? "Copied!" : "Copy All"}
                </button>
                <button
                  onClick={reset}
                  className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  New RFP
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {responses.map((resp, i) => (
                <div
                  key={resp.sectionId}
                  className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-800">
                    <h3 className="font-medium text-white">
                      {i + 1}. {resp.sectionTitle}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(resp.response, resp.sectionId)}
                      className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                    >
                      {copied === resp.sectionId ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {resp.response}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing CTA */}
            <div className="mt-12 p-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/50 rounded-xl text-center">
              <h3 className="text-xl font-bold text-white mb-2">Upgrade Your RFP Game</h3>
              <p className="text-gray-400 mb-4">
                Get unlimited AI-powered RFP responses with company profile management.
              </p>
              <div className="flex justify-center gap-4">
                <div className="px-6 py-3 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">$29</div>
                  <div className="text-xs text-gray-400">per RFP response</div>
                </div>
                <div className="px-6 py-3 bg-indigo-600 rounded-lg ring-2 ring-indigo-400">
                  <div className="text-2xl font-bold text-white">$79/mo</div>
                  <div className="text-xs text-indigo-200">unlimited responses</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
