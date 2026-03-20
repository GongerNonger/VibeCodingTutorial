"use client";

import { useState } from "react";

interface Email {
  subject: string;
  body: string;
  purpose: string;
}

type Tone = "professional" | "casual" | "direct";

const TONE_DESCRIPTIONS: Record<Tone, string> = {
  professional: "Polished and formal",
  casual: "Friendly and conversational",
  direct: "Short and to the point",
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [senderProduct, setSenderProduct] = useState("");
  const [senderDescription, setSenderDescription] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [emailCount, setEmailCount] = useState(3);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderProduct, senderDescription, targetCompany, targetRole, tone, emailCount }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setEmails(data.emails);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function handleDownloadAll() {
    const content = emails
      .map((e, i) => `--- Email ${i + 1}: ${e.purpose} ---\nSubject: ${e.subject}\n\n${e.body}\n`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${targetCompany.toLowerCase().replace(/\s+/g, "-")}-email-sequence.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setStep(1);
    setEmails([]);
    setError("");
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-gray-800">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-emerald-400">Cold</span>MailCraft
          </h1>
          <span className="text-sm text-gray-400">AI Cold Email Writer</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {step < 4 && (
          <>
            {/* Hero */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Cold emails that get{" "}
                <span className="text-emerald-400">replies</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Enter your product and target. Get a personalized email sequence
                ready to send.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= s
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-12 h-0.5 ${
                        step > s ? "bg-emerald-500" : "bg-gray-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 1: Your Product */}
        {step === 1 && (
          <div className="max-w-xl mx-auto space-y-6">
            <h3 className="text-xl font-semibold">Your Product</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product / Company Name
              </label>
              <input
                type="text"
                value={senderProduct}
                onChange={(e) => setSenderProduct(e.target.value)}
                placeholder="e.g. TaskFlow Pro"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What does it do? Key benefits?
              </label>
              <textarea
                value={senderDescription}
                onChange={(e) => setSenderDescription(e.target.value)}
                placeholder="Describe your product, its key features, and the main benefits for customers. Be specific about results."
                rows={4}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500 resize-none"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!senderProduct || !senderDescription}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Next: Target →
            </button>
          </div>
        )}

        {/* Step 2: Target */}
        {step === 2 && (
          <div className="max-w-xl mx-auto space-y-6">
            <h3 className="text-xl font-semibold">Who are you emailing?</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Company
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Person / Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Sarah, VP of Marketing  or  Head of Engineering"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!targetCompany || !targetRole}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                Next: Settings →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Tone & Count */}
        {step === 3 && (
          <div className="max-w-xl mx-auto space-y-6">
            <h3 className="text-xl font-semibold">Email Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Tone
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["professional", "casual", "direct"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-4 py-4 rounded-lg border text-left transition-colors ${
                      tone === t
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-gray-700 bg-gray-900 hover:border-gray-600"
                    }`}
                  >
                    <span
                      className={`block text-sm font-semibold capitalize ${
                        tone === t ? "text-emerald-400" : "text-gray-300"
                      }`}
                    >
                      {t}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {TONE_DESCRIPTIONS[t]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Emails in sequence: {emailCount}
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={emailCount}
                onChange={(e) => setEmailCount(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (just the intro)</span>
                <span>5 (full sequence)</span>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 text-sm text-gray-400">
              <p>
                <strong className="text-gray-200">Sending:</strong>{" "}
                {emailCount} {tone} email{emailCount > 1 ? "s" : ""} about{" "}
                <strong className="text-emerald-400">{senderProduct}</strong> to{" "}
                <strong className="text-gray-200">{targetRole}</strong> at{" "}
                <strong className="text-gray-200">{targetCompany}</strong>
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Crafting emails...
                  </span>
                ) : (
                  "Generate Email Sequence"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && emails.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold">Your Email Sequence</h3>
                <p className="text-gray-400 mt-1">
                  {emails.length} email{emails.length > 1 ? "s" : ""} for{" "}
                  {targetCompany}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadAll}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  Download All
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition-colors"
                >
                  New Sequence
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {emails.map((email, i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                >
                  {/* Email Header */}
                  <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                        Email {i + 1}
                      </span>
                      <span className="text-xs text-gray-500 ml-3">
                        {email.purpose}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(`Subject: ${email.subject}\n\n${email.body}`, i)
                      }
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors"
                    >
                      {copiedIndex === i ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Subject */}
                  <div className="px-6 py-3 border-b border-gray-800/50">
                    <span className="text-xs text-gray-500">Subject: </span>
                    <span className="text-sm font-medium">{email.subject}</span>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-5">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                      {email.body}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features (show on wizard steps) */}
        {step < 4 && (
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Sequences",
                desc: "Each email is tailored to your target company and role — not generic templates.",
              },
              {
                title: "Multiple Angles",
                desc: "Follow-ups use different strategies: pain points, social proof, value-add, and breakup.",
              },
              {
                title: "Three Tone Options",
                desc: "Professional, casual, or direct. Match the tone to your audience and brand.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 bg-gray-900 rounded-xl border border-gray-800"
              >
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 mt-20">
        <div className="mx-auto max-w-5xl px-6 py-6 text-center text-gray-500 text-sm">
          Built overnight with Claude Code Agent Teams
        </div>
      </footer>
    </div>
  );
}
