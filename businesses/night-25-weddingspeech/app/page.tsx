"use client";

import { useState, useEffect } from "react";

interface Speech {
  id: string;
  speakerRole: string;
  speakerName: string;
  coupleName1: string;
  coupleName2: string;
  howYouKnow: string;
  favoriteMemory: string;
  coupleQualities: string[];
  tone: string;
  length: string;
  generatedSpeech: string;
  wordCount: number;
  estimatedMinutes: number;
  createdAt: string;
}

const ROLES = [
  "best man",
  "maid of honor",
  "father of bride",
  "mother of bride",
  "friend",
  "sibling",
  "other",
];

const QUALITIES = [
  "funny",
  "adventurous",
  "kind",
  "loyal",
  "hardworking",
  "creative",
  "supportive",
  "inspiring",
];

const TONES = ["heartfelt", "funny", "formal", "casual"];

const LENGTHS: { value: string; label: string; time: string }[] = [
  { value: "short", label: "Short", time: "~2 min / 300 words" },
  { value: "medium", label: "Medium", time: "~4 min / 600 words" },
  { value: "long", label: "Long", time: "~6 min / 900 words" },
];

export default function Home() {
  const [speakerRole, setSpeakerRole] = useState("best man");
  const [speakerName, setSpeakerName] = useState("");
  const [coupleName1, setCoupleName1] = useState("");
  const [coupleName2, setCoupleName2] = useState("");
  const [howYouKnow, setHowYouKnow] = useState("");
  const [favoriteMemory, setFavoriteMemory] = useState("");
  const [coupleQualities, setCoupleQualities] = useState<string[]>([]);
  const [tone, setTone] = useState("heartfelt");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<Speech | null>(null);
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/speeches")
      .then((r) => r.json())
      .then(setSpeeches)
      .catch(() => {});
  }, []);

  const toggleQuality = (q: string) => {
    setCoupleQualities((prev) =>
      prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q]
    );
  };

  const handleGenerate = async () => {
    if (
      !speakerName ||
      !coupleName1 ||
      !coupleName2 ||
      !howYouKnow ||
      !favoriteMemory ||
      coupleQualities.length === 0
    ) {
      alert("Please fill in all fields and select at least one quality.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/speeches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speakerRole,
          speakerName,
          coupleName1,
          coupleName2,
          howYouKnow,
          favoriteMemory,
          coupleQualities,
          tone,
          length,
        }),
      });
      const data = await res.json();
      setCurrentSpeech(data);
      setSpeeches((prev) => [data, ...prev]);
    } catch {
      alert("Failed to generate speech. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (currentSpeech) {
      navigator.clipboard.writeText(currentSpeech.generatedSpeech);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewSpeech = (speech: Speech) => {
    setCurrentSpeech(speech);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paragraphs = currentSpeech?.generatedSpeech.split("\n\n") || [];
  const sectionLabels = ["Opening", "Anecdote", "Qualities", "Advice", "Toast"];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💒</span>
            <h1 className="text-xl font-bold text-white">
              Wedding<span className="text-pink-500">Speech</span>
            </h1>
          </div>
          <span className="text-sm text-gray-400">$15 per speech</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Craft the Perfect Wedding Speech
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tell us about the couple and your relationship, and we will create a
            heartfelt, personalized speech you can deliver with confidence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-5">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
              <h3 className="text-lg font-semibold text-pink-500">
                About You
              </h3>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Your Role
                </label>
                <select
                  value={speakerRole}
                  onChange={(e) => setSpeakerRole(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Speaker Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
              <h3 className="text-lg font-semibold text-pink-500">
                About the Couple
              </h3>

              {/* Couple Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Partner 1
                  </label>
                  <input
                    type="text"
                    value={coupleName1}
                    onChange={(e) => setCoupleName1(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Partner 2
                  </label>
                  <input
                    type="text"
                    value={coupleName2}
                    onChange={(e) => setCoupleName2(e.target.value)}
                    placeholder="e.g. Jordan"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* How You Know */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  How do you know them?
                </label>
                <textarea
                  value={howYouKnow}
                  onChange={(e) => setHowYouKnow(e.target.value)}
                  placeholder="e.g. We've been friends since college, met in our chemistry class..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              {/* Favorite Memory */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Favorite memory together
                </label>
                <textarea
                  value={favoriteMemory}
                  onChange={(e) => setFavoriteMemory(e.target.value)}
                  placeholder="e.g. The road trip where we got lost and ended up at the most beautiful sunset..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              {/* Qualities */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Couple&apos;s Best Qualities
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUALITIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => toggleQuality(q)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        coupleQualities.includes(q)
                          ? "bg-pink-500 text-white"
                          : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-pink-500 hover:text-pink-400"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
              <h3 className="text-lg font-semibold text-pink-500">
                Speech Settings
              </h3>

              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tone
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        tone === t
                          ? "bg-pink-500 text-white"
                          : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-pink-500"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Length
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LENGTHS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLength(l.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        length === l.value
                          ? "bg-pink-500 text-white"
                          : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-pink-500"
                      }`}
                    >
                      <div>{l.label}</div>
                      <div className="text-xs opacity-70">{l.time}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Generating Speech..." : "Generate My Speech - $15"}
            </button>
          </div>

          {/* Speech Display */}
          <div className="space-y-6">
            {currentSpeech ? (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Your Speech
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      {currentSpeech.wordCount} words |{" "}
                      {currentSpeech.estimatedMinutes} min
                    </span>
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-300 hover:text-pink-400 hover:border-pink-500 transition-colors"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="px-3 py-1 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-300 hover:text-pink-400 hover:border-pink-500 transition-colors disabled:opacity-50"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {paragraphs.map((paragraph, i) => (
                    <div key={i}>
                      {i < sectionLabels.length && (
                        <span className="inline-block text-xs font-semibold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded mb-1">
                          {sectionLabels[i]}
                        </span>
                      )}
                      <p className="text-gray-300 leading-relaxed">
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    Role: {currentSpeech.speakerRole}
                  </span>
                  <span>Tone: {currentSpeech.tone}</span>
                  <span>Length: {currentSpeech.length}</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                <span className="text-5xl mb-4 block">🎤</span>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Your speech will appear here
                </h3>
                <p className="text-gray-500 text-sm">
                  Fill out the form and click &quot;Generate&quot; to create
                  your personalized wedding speech.
                </p>
              </div>
            )}

            {/* Speech History */}
            {speeches.length > 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Speech History
                </h3>
                <div className="space-y-2">
                  {speeches.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleViewSpeech(s)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                        currentSpeech?.id === s.id
                          ? "border-pink-500 bg-pink-500/10"
                          : "border-gray-800 bg-gray-800/50 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                          {s.speakerRole.charAt(0).toUpperCase() +
                            s.speakerRole.slice(1)}{" "}
                          speech
                        </span>
                        <span className="text-xs text-gray-500">
                          {s.wordCount} words
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {s.coupleName1} &amp; {s.coupleName2} | {s.tone} |{" "}
                        {s.length}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
