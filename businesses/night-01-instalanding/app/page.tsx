"use client";

import { useState } from "react";

export default function Home() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState<"modern" | "bold" | "minimal">("modern");
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGeneratedHTML("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, description, style }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setGeneratedHTML(data.html);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyHTML() {
    navigator.clipboard.writeText(generatedHTML);
  }

  function handleDownload() {
    const blob = new Blob([generatedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName.toLowerCase().replace(/\s+/g, "-")}-landing.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="border-b border-gray-800">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-indigo-400">Insta</span>Landing
          </h1>
          <span className="text-sm text-gray-400">
            AI Landing Page Generator
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {!showPreview ? (
          <>
            {/* Value Prop */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Landing pages in{" "}
                <span className="text-indigo-400">seconds</span>, not hours
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Describe your product. Get a conversion-optimized, ready-to-deploy
                landing page. No design skills needed.
              </p>
            </div>

            {/* Generator Form */}
            <form
              onSubmit={handleGenerate}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. TaskFlow Pro"
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what your product does, who it's for, and its key benefits. The more detail, the better the landing page."
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["modern", "bold", "minimal"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                        style === s
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                          : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating your landing page...
                  </span>
                ) : (
                  "Generate Landing Page"
                )}
              </button>
            </form>

            {/* Features */}
            <div className="mt-20 grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered",
                  desc: "Claude generates conversion-optimized copy and layouts tailored to your product.",
                },
                {
                  title: "Ready to Deploy",
                  desc: "Download a single HTML file. Drop it on any hosting. No build step needed.",
                },
                {
                  title: "Multiple Styles",
                  desc: "Choose modern, bold, or minimal. Each optimized for different audiences.",
                },
              ].map((f) => (
                <div key={f.title} className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Preview Mode */
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                &larr; Back to Generator
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyHTML}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  Copy HTML
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                >
                  Download HTML
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="rounded-xl overflow-hidden border border-gray-700">
              <iframe
                srcDoc={generatedHTML}
                className="w-full h-[700px] bg-white"
                title="Landing Page Preview"
                sandbox="allow-scripts"
              />
            </div>

            {/* Raw HTML */}
            <details className="mt-6">
              <summary className="text-gray-400 cursor-pointer hover:text-white text-sm">
                View Raw HTML
              </summary>
              <pre className="mt-3 p-4 bg-gray-900 rounded-lg overflow-x-auto text-xs text-gray-300 max-h-96">
                <code>{generatedHTML}</code>
              </pre>
            </details>
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
