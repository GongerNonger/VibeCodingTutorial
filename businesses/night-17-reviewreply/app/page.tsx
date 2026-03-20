"use client";

import { useState, useCallback } from "react";

type Sentiment = "positive" | "negative" | "mixed";
type Tone = "professional" | "friendly" | "empathetic" | "assertive";
type Length = "brief" | "standard" | "detailed";

interface ReviewAnalysis {
  sentiment: Sentiment;
  starRating: number;
  themes: string[];
  keyPhrases: string[];
}

interface GeneratedResult {
  text: string;
  tone: Tone;
  length: Length;
  sentiment: Sentiment;
  analysis: ReviewAnalysis;
}

interface BusinessProfile {
  id: string;
  name: string;
  type: string;
  personality: string;
}

interface HistoryItem {
  id: string;
  review: string;
  analysis: ReviewAnalysis;
  response: GeneratedResult;
  timestamp: Date;
}

const toneOptions: { value: Tone; label: string; icon: string }[] = [
  { value: "professional", label: "Professional", icon: "🏢" },
  { value: "friendly", label: "Friendly", icon: "😊" },
  { value: "empathetic", label: "Empathetic", icon: "💙" },
  { value: "assertive", label: "Assertive", icon: "💪" },
];

const lengthOptions: { value: Length; label: string }[] = [
  { value: "brief", label: "Brief" },
  { value: "standard", label: "Standard" },
  { value: "detailed", label: "Detailed" },
];

function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const colors = {
    positive: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    negative: "bg-red-500/20 text-red-400 border-red-500/30",
    mixed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors[sentiment]}`}>
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-600"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessPersonality, setBusinessPersonality] = useState("");
  const [business, setBusiness] = useState<BusinessProfile | null>(null);

  const [reviewText, setReviewText] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [length, setLength] = useState<Length>("standard");

  const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSetup, setShowSetup] = useState(true);

  const saveBusiness = useCallback(async () => {
    if (!businessName.trim()) return;
    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: businessName,
          type: businessType,
          personality: businessPersonality,
        }),
      });
      const data = await res.json();
      setBusiness(data);
      setShowSetup(false);
    } catch {
      // Fallback: create locally
      setBusiness({
        id: Date.now().toString(),
        name: businessName,
        type: businessType,
        personality: businessPersonality,
      });
      setShowSetup(false);
    }
  }, [businessName, businessType, businessPersonality]);

  const handleAnalyzeAndGenerate = useCallback(async () => {
    if (!reviewText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review: reviewText,
          tone,
          length,
          business: business || undefined,
        }),
      });
      const data: GeneratedResult = await res.json();
      setAnalysis(data.analysis);
      setResult(data);

      setHistory((prev) => [
        {
          id: Date.now().toString(),
          review: reviewText,
          analysis: data.analysis,
          response: data,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    } catch {
      // Fallback error handling
    } finally {
      setLoading(false);
    }
  }, [reviewText, tone, length, business]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [result]);

  const handleRegenerateTone = useCallback(
    async (newTone: Tone) => {
      setTone(newTone);
      if (!reviewText.trim()) return;
      setLoading(true);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            review: reviewText,
            tone: newTone,
            length,
            business: business || undefined,
          }),
        });
        const data: GeneratedResult = await res.json();
        setAnalysis(data.analysis);
        setResult(data);
      } catch {
        // Error handling
      } finally {
        setLoading(false);
      }
    },
    [reviewText, length, business]
  );

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-xl font-bold">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ReviewReply</h1>
              <p className="text-xs text-gray-500">Google Review Response Writer</p>
            </div>
          </div>
          {business && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {business.name}
              <button
                onClick={() => setShowSetup(true)}
                className="text-gray-500 hover:text-emerald-400 ml-2 text-xs underline"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Business Setup */}
        {showSetup && (
          <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">1</span>
              Business Profile
            </h2>
            <p className="text-sm text-gray-400">Set up your business to personalize responses.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Mario's Pizzeria"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Business Type</label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g., Restaurant, Salon, Hotel"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Voice / Personality</label>
                <input
                  type="text"
                  value={businessPersonality}
                  onChange={(e) => setBusinessPersonality(e.target.value)}
                  placeholder="e.g., We deliver authentic Italian dining"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition"
                />
              </div>
            </div>
            <button
              onClick={saveBusiness}
              disabled={!businessName.trim()}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition"
            >
              Save Profile
            </button>
          </section>
        )}

        {/* Review Input */}
        <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">2</span>
            Paste Review
          </h2>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Paste a customer review here... (supports single or batch reviews separated by blank lines)"
            rows={5}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition resize-none"
          />

          {/* Controls */}
          <div className="flex flex-wrap gap-6 items-end">
            {/* Tone Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
              <div className="flex gap-2">
                {toneOptions.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => (result ? handleRegenerateTone(t.value) : setTone(t.value))}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition border ${
                      tone === t.value
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Length</label>
              <div className="flex gap-2">
                {lengthOptions.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLength(l.value)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition border ${
                      length === l.value
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleAnalyzeAndGenerate}
              disabled={!reviewText.trim() || loading}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Response"
              )}
            </button>
          </div>
        </section>

        {/* Analysis & Response */}
        {analysis && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sentiment Analysis */}
            <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Analysis</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Sentiment</p>
                  <SentimentBadge sentiment={analysis.sentiment} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Detected Rating</p>
                  <StarDisplay rating={analysis.starRating} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Themes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.themes.map((theme) => (
                      <span key={theme} className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Generated Response */}
            <section className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Generated Response</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="capitalize">{result.tone}</span>
                  <span>·</span>
                  <span className="capitalize">{result.length}</span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-gray-200 leading-relaxed whitespace-pre-wrap">
                {result.text}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                  copied
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:border-emerald-500/40 hover:text-emerald-400"
                }`}
              >
                {copied ? "Copied!" : "Copy Response"}
              </button>
            </section>
          </div>
        )}

        {/* Review History */}
        {history.length > 0 && (
          <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Review History</h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800 rounded-xl p-4 space-y-2 cursor-pointer hover:border-emerald-500/30 border border-transparent transition"
                  onClick={() => {
                    setReviewText(item.review);
                    setAnalysis(item.analysis);
                    setResult(item.response);
                    setTone(item.response.tone);
                    setLength(item.response.length);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SentimentBadge sentiment={item.analysis.sentiment} />
                      <StarDisplay rating={item.analysis.starRating} />
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{item.review}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-600 py-4">
          ReviewReply — $19/mo per location · Built with Next.js + Tailwind CSS
        </footer>
      </div>
    </main>
  );
}
