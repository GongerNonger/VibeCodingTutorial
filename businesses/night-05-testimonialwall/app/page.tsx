"use client";

import { useState, useEffect, useCallback } from "react";

interface Wall {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface Testimonial {
  id: string;
  wallId: string;
  author: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  createdAt: string;
}

type Mode = "manage" | "preview";
type Layout = "grid" | "masonry" | "carousel";

function StarRating({ rating, interactive, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={`text-lg ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} ${
            star <= rating ? "text-pink-500" : "text-gray-600"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-pink-500/30 transition-colors break-inside-avoid">
      <StarRating rating={t.rating} />
      <p className="mt-3 text-gray-300 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3">
        {t.avatarUrl ? (
          <img src={t.avatarUrl} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-gray-700" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-sm">
            {t.author.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-white font-semibold text-sm">{t.author}</p>
          <p className="text-gray-500 text-xs">
            {t.role}{t.company ? ` at ${t.company}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("manage");
  const [layout, setLayout] = useState<Layout>("masonry");
  const [walls, setWalls] = useState<Wall[]>([]);
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Wall form
  const [wallName, setWallName] = useState("");
  const [wallDesc, setWallDesc] = useState("");

  // Testimonial form
  const [tAuthor, setTAuthor] = useState("");
  const [tRole, setTRole] = useState("");
  const [tCompany, setTCompany] = useState("");
  const [tText, setTText] = useState("");
  const [tRating, setTRating] = useState(5);
  const [tAvatar, setTAvatar] = useState("");

  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const fetchWalls = useCallback(async () => {
    const res = await fetch("/api/walls");
    if (res.ok) setWalls(await res.json());
  }, []);

  const fetchTestimonials = useCallback(async (wallId: string) => {
    const res = await fetch(`/api/walls/${wallId}/testimonials`);
    if (res.ok) setTestimonials(await res.json());
  }, []);

  useEffect(() => {
    fetchWalls();
  }, [fetchWalls]);

  useEffect(() => {
    if (selectedWallId) fetchTestimonials(selectedWallId);
    else setTestimonials([]);
  }, [selectedWallId, fetchTestimonials]);

  const createWall = async () => {
    if (!wallName.trim()) return;
    setLoading(true);
    const res = await fetch("/api/walls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: wallName, description: wallDesc }),
    });
    if (res.ok) {
      const wall = await res.json();
      setWalls((prev) => [...prev, wall]);
      setSelectedWallId(wall.id);
      setWallName("");
      setWallDesc("");
    }
    setLoading(false);
  };

  const addTestimonial = async () => {
    if (!selectedWallId || !tAuthor.trim() || !tText.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/walls/${selectedWallId}/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: tAuthor,
        role: tRole,
        company: tCompany,
        text: tText,
        rating: tRating,
        avatarUrl: tAvatar || undefined,
      }),
    });
    if (res.ok) {
      const t = await res.json();
      setTestimonials((prev) => [...prev, t]);
      setTAuthor("");
      setTRole("");
      setTCompany("");
      setTText("");
      setTRating(5);
      setTAvatar("");
    }
    setLoading(false);
  };

  const copyEmbedCode = () => {
    if (!selectedWallId) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const snippet = `<iframe src="${origin}/api/walls/${selectedWallId}" width="100%" height="600" frameborder="0" style="border:none;border-radius:12px;"></iframe>`;
    navigator.clipboard.writeText(snippet);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const selectedWall = walls.find((w) => w.id === selectedWallId);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-pink-500 rounded-lg flex items-center justify-center font-bold text-sm">TW</div>
            <h1 className="text-xl font-bold">TestimonialWall</h1>
          </div>
          <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
            {(["manage", "preview"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === m ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {m === "manage" ? "Manage" : "Preview"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {mode === "manage" ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Create Wall */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Create a Wall</h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Wall name"
                    value={wallName}
                    onChange={(e) => setWallName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={wallDesc}
                    onChange={(e) => setWallDesc(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  <button
                    onClick={createWall}
                    disabled={loading || !wallName.trim()}
                    className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors"
                  >
                    Create Wall
                  </button>
                </div>
              </div>

              {/* Wall List */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Your Walls</h2>
                {walls.length === 0 ? (
                  <p className="text-gray-500 text-sm">No walls yet. Create one above.</p>
                ) : (
                  <div className="space-y-2">
                    {walls.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWallId(w.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                          selectedWallId === w.id
                            ? "bg-pink-500/10 border border-pink-500/30 text-pink-400"
                            : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        <span className="font-medium">{w.name}</span>
                        {w.description && <span className="block text-xs text-gray-500 mt-0.5">{w.description}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {selectedWall ? (
                <>
                  {/* Add Testimonial Form */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Add Testimonial to <span className="text-pink-400">{selectedWall.name}</span>
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Author name *"
                        value={tAuthor}
                        onChange={(e) => setTAuthor(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Role (e.g. CEO)"
                        value={tRole}
                        onChange={(e) => setTRole(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={tCompany}
                        onChange={(e) => setTCompany(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Avatar URL (optional)"
                        value={tAvatar}
                        onChange={(e) => setTAvatar(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                    <textarea
                      placeholder="Testimonial text *"
                      value={tText}
                      onChange={(e) => setTText(e.target.value)}
                      rows={3}
                      className="mt-3 w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Rating:</span>
                        <StarRating rating={tRating} interactive onChange={setTRating} />
                      </div>
                      <button
                        onClick={addTestimonial}
                        disabled={loading || !tAuthor.trim() || !tText.trim()}
                        className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors"
                      >
                        Add Testimonial
                      </button>
                    </div>
                  </div>

                  {/* Testimonials List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Testimonials <span className="text-gray-500">({testimonials.length})</span>
                      </h3>
                    </div>
                    {testimonials.length === 0 ? (
                      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                        <p className="text-gray-500">No testimonials yet. Add your first one above.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {testimonials.map((t) => (
                          <TestimonialCard key={t.id} t={t} />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-3">&#x1F4AC;</div>
                  <h3 className="text-lg font-semibold mb-2">Select or Create a Wall</h3>
                  <p className="text-gray-500 text-sm">Create a testimonial wall to start collecting feedback.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div>
            {selectedWall ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedWall.name}</h2>
                    {selectedWall.description && <p className="text-gray-400 mt-1">{selectedWall.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
                      {(["grid", "masonry", "carousel"] as Layout[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => setLayout(l)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                            layout === l ? "bg-pink-500 text-white" : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={copyEmbedCode}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        copySuccess ? "bg-green-600 text-white" : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-pink-500/30"
                      }`}
                    >
                      {copySuccess ? "Copied!" : "Copy Embed Code"}
                    </button>
                  </div>
                </div>

                {testimonials.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                    <p className="text-gray-500">No testimonials to preview. Switch to Manage mode to add some.</p>
                  </div>
                ) : layout === "carousel" ? (
                  <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                    {testimonials.map((t) => (
                      <div key={t.id} className="min-w-[350px] max-w-[400px] snap-start flex-shrink-0">
                        <TestimonialCard t={t} />
                      </div>
                    ))}
                  </div>
                ) : layout === "masonry" ? (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {testimonials.map((t) => (
                      <TestimonialCard key={t.id} t={t} />
                    ))}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                      <TestimonialCard key={t.id} t={t} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <p className="text-gray-500">Select a wall in Manage mode first to preview it.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
