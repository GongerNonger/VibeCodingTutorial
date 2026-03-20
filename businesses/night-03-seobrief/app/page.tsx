"use client";

import { useState } from "react";

interface OutlineSection {
  heading: string;
  tag: "h2" | "h3";
  notes: string;
  wordEstimate: number;
}

interface CompetitorSnippet {
  title: string;
  angle: string;
  gap: string;
}

interface ContentBrief {
  keyword: string;
  title: string;
  meta: {
    description: string;
    intent: string;
    difficulty: string;
    wordCount: number;
    audience: string;
  };
  outline: OutlineSection[];
  questionsToAnswer: string[];
  relatedKeywords: string[];
  lsiTerms: string[];
  competitors: CompetitorSnippet[];
  internalLinkingSuggestions: string[];
  contentDos: string[];
  contentDonts: string[];
}

type Intent = "informational" | "commercial" | "transactional" | "navigational";

const INTENT_INFO: Record<Intent, { label: string; desc: string; icon: string }> = {
  informational: { label: "Informational", desc: "How-to, guides, explanations", icon: "📖" },
  commercial: { label: "Commercial", desc: "Comparisons, reviews, best-of", icon: "🔍" },
  transactional: { label: "Transactional", desc: "Buy, sign up, get pricing", icon: "💳" },
  navigational: { label: "Navigational", desc: "Find a specific brand/page", icon: "🧭" },
};

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [intent, setIntent] = useState<Intent>("informational");
  const [wordCount, setWordCount] = useState(1500);
  const [audience, setAudience] = useState("");
  const [brief, setBrief] = useState<ContentBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"outline" | "keywords" | "competitors" | "guidelines">("outline");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setBrief(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, intent, wordCount, audience }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setBrief(data.brief);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleExportMarkdown() {
    if (!brief) return;
    const md = briefToMarkdown(brief);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.keyword.toLowerCase().replace(/\s+/g, "-")}-seo-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function briefToMarkdown(b: ContentBrief): string {
    let md = `# SEO Content Brief: ${b.keyword}\n\n`;
    md += `**Target Title:** ${b.title}\n`;
    md += `**Meta Description:** ${b.meta.description}\n`;
    md += `**Search Intent:** ${b.meta.intent}\n`;
    md += `**Difficulty:** ${b.meta.difficulty}\n`;
    md += `**Target Word Count:** ${b.meta.wordCount}\n`;
    md += `**Audience:** ${b.meta.audience}\n\n`;
    md += `---\n\n## Content Outline\n\n`;
    for (const s of b.outline) {
      md += `${"#".repeat(s.tag === "h2" ? 3 : 4)} ${s.heading} (~${s.wordEstimate} words)\n`;
      md += `> ${s.notes}\n\n`;
    }
    md += `---\n\n## Questions to Answer\n\n`;
    for (const q of b.questionsToAnswer) md += `- ${q}\n`;
    md += `\n## Related Keywords\n\n`;
    for (const k of b.relatedKeywords) md += `- ${k}\n`;
    md += `\n## LSI Terms to Include\n\n`;
    for (const t of b.lsiTerms) md += `- ${t}\n`;
    md += `\n---\n\n## Competitor Analysis\n\n`;
    for (const c of b.competitors) {
      md += `### ${c.title}\n- **Angle:** ${c.angle}\n- **Gap to exploit:** ${c.gap}\n\n`;
    }
    md += `## Internal Linking\n\n`;
    for (const l of b.internalLinkingSuggestions) md += `- ${l}\n`;
    md += `\n## Content Guidelines\n\n### Do\n`;
    for (const d of b.contentDos) md += `- ${d}\n`;
    md += `\n### Don't\n`;
    for (const d of b.contentDonts) md += `- ${d}\n`;
    return md;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-orange-400">SEO</span>Brief
          </h1>
          <span className="text-sm text-gray-400">AI Content Brief Generator</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {!brief && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Content briefs that <span className="text-orange-400">rank</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Enter a keyword. Get a comprehensive SEO content brief with outline,
                questions, competitor gaps, and writing guidelines.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Keyword Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Keyword</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. project management software"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && keyword && handleGenerate()}
                />
              </div>

              {/* Search Intent */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Search Intent</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(Object.entries(INTENT_INFO) as [Intent, typeof INTENT_INFO[Intent]][]).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setIntent(key)}
                      className={`px-4 py-3 rounded-lg border text-left transition-colors ${
                        intent === key
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-gray-700 bg-gray-900 hover:border-gray-600"
                      }`}
                    >
                      <span className="text-lg">{info.icon}</span>
                      <span className={`block text-sm font-semibold mt-1 ${intent === key ? "text-orange-400" : "text-gray-300"}`}>
                        {info.label}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">{info.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Word Count & Audience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Word Count: {wordCount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min={500}
                    max={5000}
                    step={100}
                    value={wordCount}
                    onChange={(e) => setWordCount(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>500</span>
                    <span>5,000</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. SaaS founders"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!keyword || loading}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating brief...
                  </span>
                ) : (
                  "Generate Content Brief"
                )}
              </button>
            </div>

            {/* Features */}
            <div className="mt-20 grid md:grid-cols-3 gap-8">
              {[
                { title: "Smart Outlines", desc: "Get structured outlines tailored to search intent with word count estimates per section." },
                { title: "Keyword Intelligence", desc: "Related keywords, LSI terms, and questions to answer — all derived from your target keyword." },
                { title: "Competitor Gap Analysis", desc: "Understand what competitors are doing and where the content gaps are for you to exploit." },
              ].map((f) => (
                <div key={f.title} className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Brief Results */}
        {brief && (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-orange-400 text-sm font-medium uppercase tracking-wider mb-1">Content Brief</p>
                <h2 className="text-2xl font-bold">{brief.title}</h2>
                <p className="text-gray-400 mt-2 max-w-2xl">{brief.meta.description}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={handleExportMarkdown} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                  Export .md
                </button>
                <button onClick={() => setBrief(null)} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-sm font-medium transition-colors">
                  New Brief
                </button>
              </div>
            </div>

            {/* Meta Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Intent", value: brief.meta.intent, color: "text-orange-400" },
                { label: "Difficulty", value: brief.meta.difficulty, color: "text-yellow-400" },
                { label: "Word Count", value: brief.meta.wordCount.toLocaleString(), color: "text-emerald-400" },
                { label: "Audience", value: brief.meta.audience, color: "text-blue-400" },
              ].map((m) => (
                <div key={m.label} className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{m.label}</p>
                  <p className={`text-sm font-semibold mt-1 ${m.color} capitalize`}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-900 p-1 rounded-lg w-fit">
              {([
                { key: "outline", label: "Outline" },
                { key: "keywords", label: "Keywords" },
                { key: "competitors", label: "Competitors" },
                { key: "guidelines", label: "Guidelines" },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-orange-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "outline" && (
              <div className="space-y-4">
                {brief.outline.map((section, i) => (
                  <div key={i} className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono text-gray-500 uppercase">{section.tag}</span>
                        <h3 className="text-lg font-semibold mt-1">{section.heading}</h3>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        ~{section.wordEstimate} words
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-3">{section.notes}</p>
                  </div>
                ))}
                <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-500">
                  Total estimated: ~{brief.outline.reduce((sum, s) => sum + s.wordEstimate, 0).toLocaleString()} words across {brief.outline.length} sections
                </div>
              </div>
            )}

            {activeTab === "keywords" && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
                  <h3 className="font-semibold text-orange-400 mb-3">Questions to Answer</h3>
                  <ul className="space-y-2">
                    {brief.questionsToAnswer.map((q, i) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-gray-600 shrink-0">?</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
                  <h3 className="font-semibold text-orange-400 mb-3">Related Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {brief.relatedKeywords.map((k, i) => (
                      <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">{k}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
                  <h3 className="font-semibold text-orange-400 mb-3">LSI Terms to Include</h3>
                  <div className="flex flex-wrap gap-2">
                    {brief.lsiTerms.map((t, i) => (
                      <span key={i} className="text-xs bg-orange-500/10 text-orange-300 px-2 py-1 rounded border border-orange-500/20">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "competitors" && (
              <div className="space-y-4">
                {brief.competitors.map((c, i) => (
                  <div key={i} className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
                    <h3 className="font-semibold">{c.title}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Their Angle</p>
                        <p className="text-sm text-gray-300 mt-1">{c.angle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Gap to Exploit</p>
                        <p className="text-sm text-orange-300 mt-1">{c.gap}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
                  <h3 className="font-semibold mb-3">Internal Linking Suggestions</h3>
                  <ul className="space-y-2">
                    {brief.internalLinkingSuggestions.map((l, i) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-orange-400 shrink-0">→</span> {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "guidelines" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
                  <h3 className="font-semibold text-emerald-400 mb-3">Do</h3>
                  <ul className="space-y-2">
                    {brief.contentDos.map((d, i) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-emerald-400 shrink-0">+</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
                  <h3 className="font-semibold text-red-400 mb-3">Don&apos;t</h3>
                  <ul className="space-y-2">
                    {brief.contentDonts.map((d, i) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2">
                        <span className="text-red-400 shrink-0">-</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 mt-20">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-gray-500 text-sm">
          Built overnight with Claude Code Agent Teams
        </div>
      </footer>
    </div>
  );
}
