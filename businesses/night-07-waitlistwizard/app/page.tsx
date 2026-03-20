"use client";

import { useState } from "react";

type Style = "minimal" | "bold" | "gradient";

export default function Home() {
  const [productName, setProductName] = useState("MyApp");
  const [tagline, setTagline] = useState("The future of productivity");
  const [description, setDescription] = useState("Join thousands of early adopters getting access to the next generation of tools.");
  const [features, setFeatures] = useState(["Lightning fast performance", "Beautiful interface", "AI-powered workflows"]);
  const [newFeature, setNewFeature] = useState("");
  const [ctaText, setCtaText] = useState("Join Waitlist");
  const [style, setStyle] = useState<Style>("gradient");
  const [socialProof, setSocialProof] = useState("Join 1,200+ early adopters");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const addFeature = () => {
    if (newFeature.trim() && features.length < 6) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (i: number) => {
    setFeatures(features.filter((_, idx) => idx !== i));
  };

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, tagline, description, features, accentColor: "#f59e0b", style, ctaText, socialProof: socialProof || undefined }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedHtml(data.html);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName.toLowerCase().replace(/\s+/g, "-")}-waitlist.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold"><span className="text-amber-400">Waitlist</span>Wizard</h1>
          <span className="text-sm text-gray-400">Launch Page Builder</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-8">
        {/* Builder Form */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold">Configure Your Waitlist</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Product Name</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Tagline</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Features ({features.length}/6)</label>
            <div className="space-y-2 mb-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm">{f}</span>
                  <button onClick={() => removeFeature(i)} className="text-gray-500 hover:text-red-400 px-2">x</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature" onKeyDown={(e) => e.key === "Enter" && addFeature()}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500" />
              <button onClick={addFeature} disabled={!newFeature.trim() || features.length >= 6}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg text-sm transition-colors">Add</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">CTA Button Text</label>
              <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Style</label>
              <div className="flex gap-2">
                {(["minimal", "bold", "gradient"] as Style[]).map((s) => (
                  <button key={s} onClick={() => setStyle(s)}
                    className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-medium capitalize border transition-colors ${style === s ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-gray-700 text-gray-500 hover:border-gray-600"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Social Proof (optional)</label>
            <input type="text" value={socialProof} onChange={(e) => setSocialProof(e.target.value)}
              placeholder="e.g. Join 1,200+ early adopters"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500" />
          </div>

          <button onClick={generate} disabled={loading || !productName.trim()}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg py-3 font-semibold transition-colors">
            {loading ? "Generating..." : "Generate Waitlist Page"}
          </button>

          {generatedHtml && (
            <div className="flex gap-3">
              <button onClick={copyHtml} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                {copied ? "Copied!" : "Copy HTML"}
              </button>
              <button onClick={downloadHtml} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                Download .html
              </button>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden min-h-[600px]">
            {generatedHtml ? (
              <iframe srcDoc={generatedHtml} className="w-full h-[700px] border-0" title="Preview" />
            ) : (
              <div className="flex items-center justify-center h-[600px] text-gray-600">
                <div className="text-center">
                  <p className="text-4xl mb-3">&#x1F680;</p>
                  <p className="text-sm">Click &quot;Generate&quot; to preview your waitlist page</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
