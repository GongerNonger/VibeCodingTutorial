"use client";

import { useState, useCallback } from "react";

interface Tier {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
}

function emptyTier(): Tier {
  return { name: "", price: "", period: "per month", features: [""], highlighted: false };
}

const STYLES = [
  { value: "minimal", label: "Minimal" },
  { value: "cards", label: "Cards" },
  { value: "gradient", label: "Gradient" },
] as const;

const COLORS = [
  { value: "#8b5cf6", label: "Violet" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#10b981", label: "Emerald" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ef4444", label: "Red" },
  { value: "#ec4899", label: "Pink" },
];

export default function Home() {
  const [productName, setProductName] = useState("My SaaS");
  const [tiers, setTiers] = useState<Tier[]>([
    { name: "Starter", price: "$9", period: "per month", features: ["1 project", "Basic analytics", "Email support"], highlighted: false },
    { name: "Pro", price: "$29", period: "per month", features: ["10 projects", "Advanced analytics", "Priority support", "API access"], highlighted: true },
    { name: "Enterprise", price: "$99", period: "per month", features: ["Unlimited projects", "Custom analytics", "24/7 support", "API access", "SSO"], highlighted: false },
  ]);
  const [style, setStyle] = useState<"minimal" | "cards" | "gradient">("cards");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [previewHTML, setPreviewHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, tiers, accentColor, style }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed.");
        return;
      }
      setPreviewHTML(data.html);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [productName, tiers, accentColor, style]);

  const updateTier = (index: number, updates: Partial<Tier>) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, ...updates } : t)));
  };

  const addTier = () => {
    if (tiers.length < 4) setTiers((prev) => [...prev, emptyTier()]);
  };

  const removeTier = (index: number) => {
    if (tiers.length > 1) setTiers((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = (tierIndex: number) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === tierIndex ? { ...t, features: [...t.features, ""] } : t))
    );
  };

  const updateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex
          ? { ...t, features: t.features.map((f, fi) => (fi === featureIndex ? value : f)) }
          : t
      )
    );
  };

  const removeFeature = (tierIndex: number, featureIndex: number) => {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex ? { ...t, features: t.features.filter((_, fi) => fi !== featureIndex) } : t
      )
    );
  };

  const copyHTML = async () => {
    if (!previewHTML) return;
    await navigator.clipboard.writeText(previewHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHTML = () => {
    if (!previewHTML) return;
    const blob = new Blob([previewHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName.toLowerCase().replace(/\s+/g, "-")}-pricing.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500 flex items-center justify-center text-white font-bold text-lg">P</div>
            <h1 className="text-xl font-bold">PricingPage</h1>
          </div>
          <p className="text-sm text-gray-400 hidden sm:block">Generate beautiful pricing pages in seconds</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Left Panel — Form */}
        <div className="lg:w-[440px] xl:w-[480px] shrink-0 border-r border-gray-800 overflow-y-auto p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition"
              placeholder="My SaaS"
            />
          </div>

          {/* Style + Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Style</label>
              <div className="flex gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`flex-1 text-xs py-1.5 rounded-lg border transition ${
                      style === s.value
                        ? "border-violet-500 bg-violet-500/10 text-violet-300"
                        : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Accent Color</label>
              <div className="flex gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setAccentColor(c.value)}
                    title={c.label}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      accentColor === c.value ? "border-white scale-110" : "border-transparent"
                    }`}
                    style={{ background: c.value }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tiers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">Pricing Tiers</label>
              {tiers.length < 4 && (
                <button onClick={addTier} className="text-xs text-violet-400 hover:text-violet-300 transition">
                  + Add tier
                </button>
              )}
            </div>
            <div className="space-y-4">
              {tiers.map((tier, ti) => (
                <div key={ti} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Tier {ti + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tier.highlighted}
                          onChange={(e) => updateTier(ti, { highlighted: e.target.checked })}
                          className="accent-violet-500"
                        />
                        <span className="text-xs text-gray-400">Highlighted</span>
                      </label>
                      {tiers.length > 1 && (
                        <button onClick={() => removeTier(ti)} className="text-xs text-red-400 hover:text-red-300">
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={tier.name}
                      onChange={(e) => updateTier(ti, { name: e.target.value })}
                      className="col-span-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-violet-500 transition"
                    />
                    <input
                      type="text"
                      placeholder="$29"
                      value={tier.price}
                      onChange={(e) => updateTier(ti, { price: e.target.value })}
                      className="col-span-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-violet-500 transition"
                    />
                    <input
                      type="text"
                      placeholder="per month"
                      value={tier.period}
                      onChange={(e) => updateTier(ti, { period: e.target.value })}
                      className="col-span-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Features</span>
                      <button onClick={() => addFeature(ti)} className="text-xs text-violet-400 hover:text-violet-300">+ Add</button>
                    </div>
                    <div className="space-y-1.5">
                      {tier.features.map((f, fi) => (
                        <div key={fi} className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder={`Feature ${fi + 1}`}
                            value={f}
                            onChange={(e) => updateFeature(ti, fi, e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:border-violet-500 transition"
                          />
                          {tier.features.length > 1 && (
                            <button
                              onClick={() => removeFeature(ti, fi)}
                              className="text-gray-600 hover:text-red-400 text-sm px-1 transition"
                            >
                              x
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-violet-500 hover:bg-violet-600 disabled:opacity-50 transition"
          >
            {loading ? "Generating..." : "Generate Pricing Page"}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        {/* Right Panel — Preview */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-3">
            <span className="text-sm font-medium text-gray-400">Preview</span>
            {previewHTML && (
              <div className="flex gap-2">
                <button
                  onClick={copyHTML}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-violet-500 hover:text-violet-300 transition"
                >
                  {copied ? "Copied!" : "Copy HTML"}
                </button>
                <button
                  onClick={downloadHTML}
                  className="text-xs px-3 py-1.5 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition"
                >
                  Download .html
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 p-4 overflow-hidden">
            {previewHTML ? (
              <iframe
                srcDoc={previewHTML}
                className="w-full h-full rounded-xl border border-gray-800"
                sandbox="allow-scripts"
                title="Pricing page preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-xl border border-dashed border-gray-800">
                <div className="text-center text-gray-600">
                  <p className="text-lg mb-1">No preview yet</p>
                  <p className="text-sm">Configure your tiers and click Generate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
