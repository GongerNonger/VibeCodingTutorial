"use client";

import { useState, useEffect, useCallback } from "react";

interface Newsletter {
  id: string;
  name: string;
  niche: string;
  tone: "casual" | "professional" | "witty";
  createdAt: string;
}

interface Edition {
  id: string;
  newsletterId: string;
  topics: string[];
  html: string;
  createdAt: string;
}

interface NewsletterWithEditions extends Newsletter {
  editions: Edition[];
}

export default function Home() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<NewsletterWithEditions | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>("");

  // Form state
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState<"casual" | "professional" | "witty">(
    "professional"
  );

  // Topics state
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchNewsletters = useCallback(async () => {
    const res = await fetch("/api/newsletters");
    const data = await res.json();
    setNewsletters(data);
  }, []);

  useEffect(() => {
    fetchNewsletters();
  }, [fetchNewsletters]);

  const selectNewsletter = async (id: string) => {
    const res = await fetch(`/api/newsletters/${id}`);
    const data = await res.json();
    setSelectedNewsletter(data);
    setGeneratedHtml("");
    setTopics([]);
    setTopicInput("");
  };

  const createNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !niche) return;

    const res = await fetch("/api/newsletters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, niche, tone }),
    });
    const data = await res.json();
    setName("");
    setNiche("");
    setTone("professional");
    await fetchNewsletters();
    await selectNewsletter(data.id);
  };

  const addTopic = () => {
    const trimmed = topicInput.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics([...topics, trimmed]);
      setTopicInput("");
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const generateEdition = async () => {
    if (!selectedNewsletter || topics.length === 0) return;
    setLoading(true);

    const res = await fetch(
      `/api/newsletters/${selectedNewsletter.id}/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics }),
      }
    );
    const data = await res.json();
    setGeneratedHtml(data.html);
    setLoading(false);

    // Refresh editions list
    await selectNewsletter(selectedNewsletter.id);
  };

  const copyHtml = async () => {
    await navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center text-white font-bold text-lg">
            N
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">NewsletterPilot</h1>
            <p className="text-sm text-gray-400">
              Newsletter Content Assistant
            </p>
          </div>
          <div className="ml-auto flex gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              $15/mo Hobby
            </span>
            <span className="px-2 py-1 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              $39/mo Pro
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Setup & Topics */}
          <div className="space-y-6">
            {/* Create Newsletter */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4 text-violet-400">
                Create Newsletter
              </h2>
              <form onSubmit={createNewsletter} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Newsletter Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Tech Pulse Weekly"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Niche
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g., tech, marketing, fitness"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Tone
                  </label>
                  <div className="flex gap-2">
                    {(["casual", "professional", "witty"] as const).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTone(t)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          tone === t
                            ? "bg-violet-500 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Create Newsletter
                </button>
              </form>
            </div>

            {/* Newsletter List */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4 text-violet-400">
                Your Newsletters
              </h2>
              {newsletters.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No newsletters yet. Create one above!
                </p>
              ) : (
                <div className="space-y-2">
                  {newsletters.map((nl) => (
                    <button
                      key={nl.id}
                      onClick={() => selectNewsletter(nl.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedNewsletter?.id === nl.id
                          ? "bg-violet-500/20 border border-violet-500/40"
                          : "bg-gray-800 hover:bg-gray-750 border border-transparent"
                      }`}
                    >
                      <div className="font-medium text-white">{nl.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {nl.niche} &middot; {nl.tone}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Topics & Generation */}
          <div className="space-y-6">
            {selectedNewsletter ? (
              <>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h2 className="text-lg font-semibold mb-1 text-violet-400">
                    {selectedNewsletter.name}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Add topics for this week&apos;s edition
                  </p>

                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTopic();
                        }
                      }}
                      placeholder="Enter a topic..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                    <button
                      onClick={addTopic}
                      className="bg-gray-800 hover:bg-gray-700 text-violet-400 px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>

                  {topics.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {topics.map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-gray-200">
                            {i + 1}. {topic}
                          </span>
                          <button
                            onClick={() => removeTopic(i)}
                            className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={generateEdition}
                    disabled={topics.length === 0 || loading}
                    className="w-full bg-violet-500 hover:bg-violet-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {loading ? "Generating..." : "Generate Newsletter"}
                  </button>
                </div>

                {/* Edition History */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h2 className="text-lg font-semibold mb-4 text-violet-400">
                    Edition History
                  </h2>
                  {selectedNewsletter.editions &&
                  selectedNewsletter.editions.length > 0 ? (
                    <div className="space-y-2">
                      {[...selectedNewsletter.editions]
                        .reverse()
                        .map((ed, i) => (
                          <button
                            key={ed.id}
                            onClick={() => setGeneratedHtml(ed.html)}
                            className="w-full text-left bg-gray-800 hover:bg-gray-750 rounded-lg px-4 py-3 transition-colors"
                          >
                            <div className="text-sm font-medium text-white">
                              Edition #{selectedNewsletter.editions.length - i}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {ed.topics.join(", ")}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(ed.createdAt).toLocaleDateString()}
                            </div>
                          </button>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No editions yet. Generate one above!
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
                <div className="text-gray-500 py-12">
                  <div className="text-4xl mb-3 opacity-40">&#9993;</div>
                  <p className="text-lg font-medium text-gray-400">
                    Select a newsletter
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose from the list or create a new one
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-violet-400">
                  Preview
                </h2>
                {generatedHtml && (
                  <button
                    onClick={copyHtml}
                    className="bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition-colors"
                  >
                    {copied ? "Copied!" : "Copy HTML"}
                  </button>
                )}
              </div>
              {generatedHtml ? (
                <div className="bg-white rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={generatedHtml}
                    className="w-full border-0"
                    style={{ height: "600px" }}
                    title="Newsletter Preview"
                  />
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <div className="text-4xl mb-3 opacity-40">&#128240;</div>
                  <p className="text-sm">
                    Generated newsletter will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
