"use client";

import { useState, useEffect, useCallback } from "react";

interface ThumbnailSuggestion {
  id: string;
  primaryText: string;
  subtitleText: string | null;
  colorScheme: string;
  fontStyle: string;
  viralScore: number;
}

interface ThumbnailProject {
  id: string;
  videoTitle: string;
  niche: string;
  targetEmotion: string;
  suggestions: ThumbnailSuggestion[];
  createdAt: string;
}

const NICHES = [
  "programming",
  "gaming",
  "cooking",
  "fitness",
  "finance",
  "tech",
  "travel",
  "beauty",
  "music",
  "education",
];

const EMOTIONS = [
  { value: "curiosity", label: "Curiosity", emoji: "🤔" },
  { value: "shock", label: "Shock", emoji: "😱" },
  { value: "excitement", label: "Excitement", emoji: "🔥" },
  { value: "fear", label: "Fear", emoji: "😨" },
  { value: "joy", label: "Joy", emoji: "😊" },
];

const TIPS = [
  "Keep text to 3-5 words max — less is more",
  "Use ALL CAPS for maximum impact",
  "Contrast text color with background",
  "Place text on the left or right third",
  "Use faces showing strong emotions",
  "Yellow + black is the highest contrast combo",
  "Add a subtle text shadow or outline",
  "Test your thumbnail at small sizes (mobile)",
  "Avoid text that repeats the video title",
  "Numbers in thumbnails boost CTR by 15%",
];

function parseColorScheme(scheme: string): { bg: string; text: string } {
  const match = scheme.match(/(#[0-9A-Fa-f]{6})\s+on\s+(#[0-9A-Fa-f]{6})/);
  if (match) {
    return { text: match[1], bg: match[2] };
  }
  return { text: "#FFFFFF", bg: "#1a1a2e" };
}

function viralScoreColor(score: number): string {
  if (score >= 90) return "text-green-400";
  if (score >= 80) return "text-yellow-400";
  if (score >= 70) return "text-orange-400";
  return "text-red-400";
}

function viralScoreBarColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-yellow-500";
  if (score >= 70) return "bg-orange-500";
  return "bg-red-500";
}

export default function Home() {
  const [projects, setProjects] = useState<ThumbnailProject[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<ThumbnailProject | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [niche, setNiche] = useState("programming");
  const [emotion, setEmotion] = useState("curiosity");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/thumbnails");
    const data = await res.json();
    setProjects(data);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;

    setLoading(true);
    const res = await fetch("/api/thumbnails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoTitle: videoTitle.trim(),
        niche,
        targetEmotion: emotion,
      }),
    });
    const project = await res.json();
    setVideoTitle("");
    await fetchProjects();
    setSelectedProject(project);
    setLoading(false);
  };

  const handleGenerate = async (projectId: string) => {
    setGenerating(true);
    const res = await fetch(`/api/thumbnails/${projectId}/generate`, {
      method: "POST",
    });
    const data = await res.json();
    // Refresh the project
    const projRes = await fetch(`/api/thumbnails/${projectId}`);
    const updatedProject = await projRes.json();
    setSelectedProject(updatedProject);
    await fetchProjects();
    setGenerating(false);
    return data;
  };

  const handleCopy = async (suggestion: ThumbnailSuggestion) => {
    const text = suggestion.subtitleText
      ? `${suggestion.primaryText}\n${suggestion.subtitleText}`
      : suggestion.primaryText;
    await navigator.clipboard.writeText(text);
    setCopiedId(suggestion.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectProject = async (project: ThumbnailProject) => {
    const res = await fetch(`/api/thumbnails/${project.id}`);
    const data = await res.json();
    setSelectedProject(data);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ThumbnailCopy</h1>
              <p className="text-xs text-gray-400">
                YouTube Thumbnail Text Optimizer
              </p>
            </div>
          </div>
          <span className="text-sm text-gray-500">$9/mo Pro</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Form + Project List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Create Project Form */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h2 className="text-lg font-semibold text-orange-500 mb-4">
                New Project
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g. 10 React Tips for Beginners"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Niche
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    {NICHES.map((n) => (
                      <option key={n} value={n}>
                        {n.charAt(0).toUpperCase() + n.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Target Emotion
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {EMOTIONS.map((em) => (
                      <button
                        key={em.value}
                        type="button"
                        onClick={() => setEmotion(em.value)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-all ${
                          emotion === em.value
                            ? "border-orange-500 bg-orange-500/10 text-orange-400"
                            : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        <span>{em.emoji}</span>
                        <span>{em.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !videoTitle.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  {loading ? "Creating..." : "Create Project"}
                </button>
              </form>
            </div>

            {/* Project List */}
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h2 className="text-lg font-semibold text-orange-500 mb-3">
                Projects
              </h2>
              {projects.length === 0 ? (
                <p className="text-gray-500 text-sm">No projects yet</p>
              ) : (
                <div className="space-y-2">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectProject(p)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedProject?.id === p.id
                          ? "bg-orange-500/10 border border-orange-500/50 text-white"
                          : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      <div className="font-medium truncate">
                        {p.videoTitle}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {p.niche} &middot; {p.suggestions.length} suggestions
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Column: Preview */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedProject.videoTitle}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {selectedProject.niche} &middot;{" "}
                      {
                        EMOTIONS.find(
                          (e) => e.value === selectedProject.targetEmotion
                        )?.emoji
                      }{" "}
                      {selectedProject.targetEmotion}
                    </p>
                  </div>
                  <button
                    onClick={() => handleGenerate(selectedProject.id)}
                    disabled={generating}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex-shrink-0"
                  >
                    {generating
                      ? "Generating..."
                      : selectedProject.suggestions.length > 0
                      ? "Regenerate"
                      : "Generate Suggestions"}
                  </button>
                </div>

                {selectedProject.suggestions.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                    <div className="text-4xl mb-3">🎨</div>
                    <p className="text-gray-400">
                      Click &quot;Generate Suggestions&quot; to get 5 optimized
                      thumbnail text options
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {selectedProject.suggestions.map((s, i) => {
                      const colors = parseColorScheme(s.colorScheme);
                      return (
                        <div
                          key={s.id}
                          className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                        >
                          {/* Mock thumbnail preview */}
                          <div
                            className="relative w-full h-48 flex flex-col items-center justify-center px-6"
                            style={{ backgroundColor: colors.bg }}
                          >
                            <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                              #{i + 1}
                            </span>
                            <p
                              className="text-3xl font-extrabold text-center leading-tight tracking-wide drop-shadow-lg"
                              style={{ color: colors.text }}
                            >
                              {s.primaryText}
                            </p>
                            {s.subtitleText && (
                              <p
                                className="text-lg font-semibold mt-2 opacity-90 drop-shadow"
                                style={{ color: colors.text }}
                              >
                                {s.subtitleText}
                              </p>
                            )}
                          </div>

                          {/* Details */}
                          <div className="p-4 flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500">
                                  Font:
                                </span>
                                <span className="text-sm text-gray-300">
                                  {s.fontStyle}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500">
                                  Colors:
                                </span>
                                <span className="text-sm text-gray-300">
                                  {s.colorScheme}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500">
                                  Viral Score:
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${viralScoreBarColor(s.viralScore)}`}
                                      style={{ width: `${s.viralScore}%` }}
                                    />
                                  </div>
                                  <span
                                    className={`text-sm font-bold ${viralScoreColor(s.viralScore)}`}
                                  >
                                    {s.viralScore}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleCopy(s)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                copiedId === s.id
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-orange-400"
                              }`}
                            >
                              {copiedId === s.id ? "Copied!" : "Copy Text"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
                <div className="text-5xl mb-4">🖼️</div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Welcome to ThumbnailCopy
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Create a new project or select an existing one to generate
                  optimized thumbnail text for your YouTube videos.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Tips Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 sticky top-8">
              <h2 className="text-lg font-semibold text-orange-500 mb-4">
                Thumbnail Tips
              </h2>
              <ul className="space-y-3">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-orange-500 font-bold mt-0.5 flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
