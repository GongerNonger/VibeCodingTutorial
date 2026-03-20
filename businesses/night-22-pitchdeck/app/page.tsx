"use client";

import { useState, useEffect } from "react";

interface Slide {
  slideNumber: number;
  title: string;
  content: string;
  talkingPoints: string[];
  designSuggestion: string;
}

interface PitchDeck {
  id: string;
  companyName: string;
  industry: string;
  stage: string;
  slides: Slide[];
  createdAt: string;
}

interface DeckSummary {
  id: string;
  companyName: string;
  industry: string;
  stage: string;
  slideCount: number;
  createdAt: string;
}

const INDUSTRIES = ["SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "Marketplace", "Other"];
const STAGES = [
  { value: "pre-seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
];

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("SaaS");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [fundingAsk, setFundingAsk] = useState("");
  const [teamSize, setTeamSize] = useState("3");
  const [stage, setStage] = useState("seed");

  const [deck, setDeck] = useState<PitchDeck | null>(null);
  const [history, setHistory] = useState<DeckSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "scroll">("scroll");

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/decks");
      const data = await res.json();
      setHistory(data);
    } catch {
      // ignore
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          industry,
          problem,
          solution,
          targetMarket,
          businessModel,
          fundingAsk,
          teamSize: Number(teamSize),
          stage,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setDeck(data);
        setCurrentSlide(0);
        fetchHistory();
      }
    } catch {
      alert("Failed to generate deck");
    } finally {
      setLoading(false);
    }
  }

  async function loadDeck(id: string) {
    try {
      const res = await fetch(`/api/decks/${id}`);
      const data = await res.json();
      setDeck(data);
      setCurrentSlide(0);
    } catch {
      // ignore
    }
  }

  function copyDeckAsText() {
    if (!deck) return;
    const text = deck.slides
      .map((s) => {
        const points = s.talkingPoints.map((p) => `  - ${p}`).join("\n");
        return `SLIDE ${s.slideNumber}: ${s.title}\n${s.content}\n\nTalking Points:\n${points}\n\nDesign: ${s.designSuggestion}`;
      })
      .join("\n\n---\n\n");
    const full = `${deck.companyName} - Pitch Deck\n${"=".repeat(40)}\n\n${text}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-gray-950 text-lg">
              P
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PitchDeck</h1>
              <p className="text-xs text-gray-500">AI Pitch Deck Outline Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">$19/deck or $39/mo unlimited</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form + History */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleGenerate} className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-amber-500">Describe Your Startup</h2>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="e.g. CloudMetrics"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Problem Statement</label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 h-20 resize-none"
                placeholder="What problem does your startup solve?"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Solution</label>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 h-20 resize-none"
                placeholder="How does your product solve it?"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Target Market</label>
              <input
                type="text"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="e.g. Mid-market B2B companies"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Business Model</label>
              <input
                type="text"
                value={businessModel}
                onChange={(e) => setBusinessModel(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                placeholder="e.g. SaaS subscription, $49/mo per seat"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Funding Ask</label>
                <input
                  type="text"
                  value={fundingAsk}
                  onChange={(e) => setFundingAsk(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                  placeholder="e.g. $2M"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Team Size</label>
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-gray-950 font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? "Generating Deck..." : "Generate Pitch Deck"}
            </button>
          </form>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Deck History</h3>
              <div className="space-y-2">
                {history.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => loadDeck(h.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      deck?.id === h.id
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    <div className="font-medium">{h.companyName}</div>
                    <div className="text-xs text-gray-500">
                      {h.industry} &middot; {h.slideCount} slides
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Generated Deck */}
        <div className="lg:col-span-2">
          {!deck ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
              <div className="text-6xl mb-4 text-amber-500/20 font-bold">PD</div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Deck Generated Yet</h3>
              <p className="text-sm text-gray-600">
                Fill out the form to generate a structured pitch deck outline with talking points for every slide.
              </p>
            </div>
          ) : (
            <div>
              {/* Deck Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{deck.companyName}</h2>
                  <p className="text-sm text-gray-500">
                    {deck.industry} &middot; {deck.slides.length} slides
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === "scroll" ? "single" : "scroll")}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {viewMode === "scroll" ? "Single Slide" : "Scroll View"}
                  </button>
                  <button
                    onClick={copyDeckAsText}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-sm transition-colors"
                  >
                    {copied ? "Copied!" : "Copy as Text"}
                  </button>
                </div>
              </div>

              {/* Slide Navigation (single mode) */}
              {viewMode === "single" && (
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30 text-sm transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Slide {currentSlide + 1} of {deck.slides.length}
                  </span>
                  <button
                    onClick={() => setCurrentSlide(Math.min(deck.slides.length - 1, currentSlide + 1))}
                    disabled={currentSlide === deck.slides.length - 1}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30 text-sm transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Slides */}
              <div className={viewMode === "scroll" ? "space-y-4" : ""}>
                {(viewMode === "scroll" ? deck.slides : [deck.slides[currentSlide]]).map((slide) => (
                  <div
                    key={slide.slideNumber}
                    className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
                  >
                    {/* Slide Number + Title */}
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                      <span className="w-8 h-8 flex-shrink-0 bg-amber-500 rounded-lg flex items-center justify-center text-gray-950 font-bold text-sm">
                        {slide.slideNumber}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{slide.title}</h3>
                    </div>

                    <div className="px-6 py-5 space-y-4">
                      {/* Content */}
                      <p className="text-gray-300 text-sm leading-relaxed">{slide.content}</p>

                      {/* Talking Points */}
                      <div>
                        <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">
                          Talking Points
                        </h4>
                        <ul className="space-y-1.5">
                          {slide.talkingPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                              <span className="text-amber-500 mt-0.5 flex-shrink-0">&#8226;</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Design Suggestion */}
                      <p className="text-xs italic text-gray-600 border-t border-gray-800 pt-3">
                        Design: {slide.designSuggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
