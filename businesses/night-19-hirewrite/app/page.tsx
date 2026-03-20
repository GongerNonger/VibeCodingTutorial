"use client";

import { useState } from "react";

type Step = "role" | "requirements" | "company" | "tone" | "result";
type Tone = "startup-casual" | "corporate-formal" | "creative";
type WorkMode = "remote" | "hybrid" | "onsite";

interface BiasMatch {
  term: string;
  index: number;
  category: string;
  suggestion: string;
  explanation: string;
}

interface BiasResult {
  matches: BiasMatch[];
  score: number;
  totalIssues: number;
}

interface GeneratedJD {
  aboutUs: string;
  roleOverview: string;
  responsibilities: string[];
  mustHaveRequirements: string[];
  niceToHaveRequirements: string[];
  benefits: string[];
  howToApply: string;
  fullText: string;
}

export default function Home() {
  const [step, setStep] = useState<Step>("role");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Role details
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("mid");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState<WorkMode>("remote");

  // Requirements
  const [mustHaveSkills, setMustHaveSkills] = useState("");
  const [niceToHaveSkills, setNiceToHaveSkills] = useState("");
  const [experience, setExperience] = useState("3");
  const [education, setEducation] = useState("");

  // Company
  const [companyName, setCompanyName] = useState("");
  const [mission, setMission] = useState("");
  const [benefits, setBenefits] = useState("");
  const [culture, setCulture] = useState("");

  // Tone & template
  const [tone, setTone] = useState<Tone>("startup-casual");
  const [templateId, setTemplateId] = useState("tech-startup");

  // Results
  const [generatedJD, setGeneratedJD] = useState<GeneratedJD | null>(null);
  const [biasResult, setBiasResult] = useState<BiasResult | null>(null);

  const steps: Step[] = ["role", "requirements", "company", "tone", "result"];
  const stepLabels: Record<Step, string> = {
    role: "Role Details",
    requirements: "Requirements",
    company: "Company Info",
    tone: "Tone & Style",
    result: "Generated JD",
  };

  async function handleGenerate() {
    setLoading(true);
    try {
      const payload = {
        role: { title, department, level, location, workMode },
        requirements: {
          mustHaveSkills: mustHaveSkills.split(",").map((s) => s.trim()).filter(Boolean),
          niceToHaveSkills: niceToHaveSkills.split(",").map((s) => s.trim()).filter(Boolean),
          experience,
          education,
        },
        company: {
          name: companyName,
          mission,
          benefits: benefits.split(",").map((s) => s.trim()).filter(Boolean),
          culture,
        },
        tone,
        templateId,
      };

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const jd: GeneratedJD = await genRes.json();
      setGeneratedJD(jd);

      // Run bias check on the full text
      const biasRes = await fetch("/api/bias-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: jd.fullText }),
      });
      const bias: BiasResult = await biasRes.json();
      setBiasResult(bias);

      setStep("result");
    } catch (e) {
      console.error("Generation failed:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (generatedJD) {
      navigator.clipboard.writeText(generatedJD.fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleExport() {
    if (generatedJD) {
      const blob = new Blob([generatedJD.fullText], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-job-description.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  const currentStepIndex = steps.indexOf(step);

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-violet-500">Hire</span>Write
              </h1>
              <p className="mt-1 text-gray-400">
                Generate inclusive, optimized job postings with bias detection
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>$5 per post</div>
              <div className="text-violet-400">$29/mo unlimited</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Step Indicator */}
        {step !== "result" && (
          <div className="mb-8 flex items-center justify-center gap-2">
            {steps.filter((s) => s !== "result").map((s, i) => (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => setStep(s)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    s === step
                      ? "bg-violet-500 text-white"
                      : i < currentStepIndex
                        ? "bg-violet-500/20 text-violet-400"
                        : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {i + 1}
                </button>
                <span
                  className={`ml-2 text-sm ${s === step ? "text-white" : "text-gray-500"}`}
                >
                  {stepLabels[s]}
                </span>
                {i < 3 && (
                  <div className="mx-4 h-px w-8 bg-gray-800" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step: Role Details */}
        {step === "role" && (
          <div className="mx-auto max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-8">
            <h2 className="mb-6 text-xl font-semibold text-white">Role Details</h2>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Department *
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Engineering"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid-Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Work Mode
                  </label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep("requirements")}
                disabled={!title || !department}
                className="rounded-lg bg-violet-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step: Requirements */}
        {step === "requirements" && (
          <div className="mx-auto max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-8">
            <h2 className="mb-6 text-xl font-semibold text-white">Requirements</h2>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Must-Have Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={mustHaveSkills}
                  onChange={(e) => setMustHaveSkills(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Nice-to-Have Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={niceToHaveSkills}
                  onChange={(e) => setNiceToHaveSkills(e.target.value)}
                  placeholder="e.g. GraphQL, AWS, Docker"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-300">
                    Education
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. BS in Computer Science or equivalent"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep("role")}
                className="rounded-lg border border-gray-700 px-6 py-2.5 font-medium text-gray-300 transition-colors hover:bg-gray-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep("company")}
                className="rounded-lg bg-violet-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-violet-600"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step: Company Info */}
        {step === "company" && (
          <div className="mx-auto max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-8">
            <h2 className="mb-6 text-xl font-semibold text-white">Company Info</h2>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Inc."
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Mission Statement
                </label>
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="e.g. revolutionize how teams collaborate"
                  rows={2}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Benefits (comma separated)
                </label>
                <input
                  type="text"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="e.g. Health insurance, 401k, Unlimited PTO"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Culture Description
                </label>
                <textarea
                  value={culture}
                  onChange={(e) => setCulture(e.target.value)}
                  placeholder="e.g. We value transparency, continuous learning, and work-life balance."
                  rows={2}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep("requirements")}
                className="rounded-lg border border-gray-700 px-6 py-2.5 font-medium text-gray-300 transition-colors hover:bg-gray-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep("tone")}
                className="rounded-lg bg-violet-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-violet-600"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step: Tone & Style */}
        {step === "tone" && (
          <div className="mx-auto max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-8">
            <h2 className="mb-6 text-xl font-semibold text-white">Tone & Style</h2>
            <div className="space-y-5">
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-300">
                  Writing Tone
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { value: "startup-casual", label: "Startup Casual", desc: "Friendly, relaxed, approachable" },
                      { value: "corporate-formal", label: "Corporate Formal", desc: "Professional, polished, traditional" },
                      { value: "creative", label: "Creative", desc: "Bold, inspiring, unique" },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`rounded-lg border p-4 text-left transition-colors ${
                        tone === t.value
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <div className={`text-sm font-medium ${tone === t.value ? "text-violet-400" : "text-white"}`}>
                        {t.label}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Industry Template
                </label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="tech-startup">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="education">Education</option>
                  <option value="creative">Creative & Marketing</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep("company")}
                className="rounded-lg border border-gray-700 px-6 py-2.5 font-medium text-gray-300 transition-colors hover:bg-gray-800"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-lg bg-violet-500 px-8 py-2.5 font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Job Description"}
              </button>
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === "result" && generatedJD && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Generated JD */}
            <div className="lg:col-span-2 rounded-xl border border-gray-800 bg-gray-900 p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Generated Job Description</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={handleExport}
                    className="rounded-lg bg-violet-500 px-4 py-2 text-sm text-white transition-colors hover:bg-violet-600"
                  >
                    Export .md
                  </button>
                </div>
              </div>

              <div className="space-y-6 text-gray-300">
                <section>
                  <h3 className="mb-2 text-lg font-semibold text-violet-400">About Us</h3>
                  <p>{generatedJD.aboutUs}</p>
                </section>
                <section>
                  <h3 className="mb-2 text-lg font-semibold text-violet-400">Role Overview</h3>
                  <p>{generatedJD.roleOverview}</p>
                </section>
                <section>
                  <h3 className="mb-2 text-lg font-semibold text-violet-400">Responsibilities</h3>
                  <ul className="list-disc space-y-1 pl-5">
                    {generatedJD.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="mb-2 text-lg font-semibold text-violet-400">Requirements</h3>
                  <h4 className="mb-1 text-sm font-medium text-gray-400">Must Have</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    {generatedJD.mustHaveRequirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  {generatedJD.niceToHaveRequirements.length > 0 && (
                    <>
                      <h4 className="mb-1 mt-3 text-sm font-medium text-gray-400">Nice to Have</h4>
                      <ul className="list-disc space-y-1 pl-5">
                        {generatedJD.niceToHaveRequirements.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </section>
                <section>
                  <h3 className="mb-2 text-lg font-semibold text-violet-400">Benefits</h3>
                  <ul className="list-disc space-y-1 pl-5">
                    {generatedJD.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="mb-2 text-lg font-semibold text-violet-400">How to Apply</h3>
                  <p>{generatedJD.howToApply}</p>
                </section>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setStep("role")}
                  className="rounded-lg border border-gray-700 px-6 py-2.5 font-medium text-gray-300 transition-colors hover:bg-gray-800"
                >
                  Start Over
                </button>
              </div>
            </div>

            {/* Bias Detection Panel */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Bias Detection</h2>
              {biasResult && (
                <>
                  <div className="mb-6 text-center">
                    <div
                      className={`inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold ${
                        biasResult.score >= 80
                          ? "bg-green-500/20 text-green-400"
                          : biasResult.score >= 50
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {biasResult.score}
                    </div>
                    <p className="mt-2 text-sm text-gray-400">Inclusivity Score</p>
                    <p className="text-xs text-gray-500">
                      {biasResult.totalIssues} issue{biasResult.totalIssues !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  {biasResult.matches.length === 0 ? (
                    <div className="rounded-lg bg-green-500/10 p-4 text-center text-sm text-green-400">
                      No biased or exclusionary language detected. Great job!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {biasResult.matches.map((match, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-gray-700 bg-gray-800 p-3"
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-mono text-sm text-red-400">
                              &quot;{match.term}&quot;
                            </span>
                            <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
                              {match.category}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-400">{match.explanation}</p>
                          <p className="mt-1 text-xs text-violet-400">
                            Suggest: {match.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
