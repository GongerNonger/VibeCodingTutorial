"use client";

import { useState, useEffect } from "react";

interface BiasWarning {
  text: string;
  severity: "low" | "medium" | "high";
  suggestion: string;
  category: string;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: string;
  employmentType: string;
  experienceLevel: string;
  salaryRange: string;
  department: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  niceToHaves: string[];
  benefits: string[];
  biasWarnings: BiasWarning[];
  inclusivityScore: number;
  createdAt: string;
}

const WORK_MODES = ["remote", "hybrid", "onsite"] as const;
const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract"] as const;
const EXPERIENCE_LEVELS = ["entry", "mid", "senior", "lead"] as const;

export default function HomePage() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    workMode: "remote" as string,
    employmentType: "full-time" as string,
    experienceLevel: "mid" as string,
    salaryRange: "",
    department: "",
    notes: "",
  });

  const [currentPosting, setCurrentPosting] = useState<JobPosting | null>(null);
  const [history, setHistory] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    setError("");
    if (!form.title || !form.company || !form.location || !form.department) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate posting");
        return;
      }
      setCurrentPosting(data);
      setHistory((prev) => [data, ...prev]);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentPosting) return;
    const text = formatPostingAsText(currentPosting);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSelectHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();
      if (res.ok) setCurrentPosting(data);
    } catch {}
  };

  const scoreColor = (score: number) =>
    score >= 75
      ? "text-green-400"
      : score >= 50
      ? "text-yellow-400"
      : "text-red-400";

  const scoreBg = (score: number) =>
    score >= 75
      ? "bg-green-500"
      : score >= 50
      ? "bg-yellow-500"
      : "bg-red-500";

  const severityColor = (s: string) =>
    s === "high"
      ? "text-red-400 bg-red-950 border-red-800"
      : s === "medium"
      ? "text-yellow-400 bg-yellow-950 border-yellow-800"
      : "text-blue-400 bg-blue-950 border-blue-800";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-lg">
              H
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">HireWrite</h1>
              <p className="text-xs text-gray-400">
                Inclusive Job Description Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="hidden sm:inline">$5/post or $29/mo unlimited</span>
            <button className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Role Details
              </h2>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-950 border border-red-800 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Field
                  label="Job Title *"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                />
                <Field
                  label="Company *"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Inc"
                />
                <Field
                  label="Location *"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                />

                <SelectField
                  label="Work Mode"
                  name="workMode"
                  value={form.workMode}
                  onChange={handleChange}
                  options={WORK_MODES}
                />
                <SelectField
                  label="Employment Type"
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  options={EMPLOYMENT_TYPES}
                />
                <SelectField
                  label="Experience Level"
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                  options={EXPERIENCE_LEVELS}
                />

                <Field
                  label="Salary Range"
                  name="salaryRange"
                  value={form.salaryRange}
                  onChange={handleChange}
                  placeholder="e.g. $100,000 - $150,000"
                />
                <Field
                  label="Department *"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    placeholder="Any specific requirements or context..."
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-6 w-full bg-sky-500 hover:bg-sky-400 disabled:bg-sky-800 disabled:text-sky-400 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? "Generating..." : "Generate Job Posting"}
              </button>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Job History
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => handleSelectHistory(job.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        currentPosting?.id === job.id
                          ? "border-sky-500 bg-sky-950/30"
                          : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <div className="text-sm font-medium text-white truncate">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {job.company} &middot;{" "}
                        <span className={scoreColor(job.inclusivityScore)}>
                          Score: {job.inclusivityScore}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Preview */}
          <div className="lg:col-span-2 space-y-6">
            {currentPosting ? (
              <>
                {/* Score and bias panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Inclusivity Score */}
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">
                      Inclusivity Score
                    </h3>
                    <div className="flex items-end gap-3">
                      <span
                        className={`text-4xl font-bold ${scoreColor(
                          currentPosting.inclusivityScore
                        )}`}
                      >
                        {currentPosting.inclusivityScore}
                      </span>
                      <span className="text-gray-500 text-sm mb-1">/ 100</span>
                    </div>
                    <div className="mt-3 w-full bg-gray-800 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${scoreBg(
                          currentPosting.inclusivityScore
                        )}`}
                        style={{
                          width: `${currentPosting.inclusivityScore}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {currentPosting.inclusivityScore >= 75
                        ? "Great! This posting is inclusive and welcoming."
                        : currentPosting.inclusivityScore >= 50
                        ? "Good, but there are some areas to improve."
                        : "Needs work. Review the bias warnings below."}
                    </p>
                  </div>

                  {/* Bias Detection */}
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">
                      Bias Detection
                    </h3>
                    {currentPosting.biasWarnings.length === 0 ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          No bias detected
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {currentPosting.biasWarnings.map((w, i) => (
                          <div
                            key={i}
                            className={`text-xs p-2 rounded-lg border ${severityColor(
                              w.severity
                            )}`}
                          >
                            <div className="font-medium">{w.text}</div>
                            <div className="mt-1 opacity-80">
                              {w.suggestion}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Posting Preview */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">
                      Generated Posting
                    </h2>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700"
                    >
                      {copied ? (
                        <>
                          <svg
                            className="w-4 h-4 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy Posting
                        </>
                      )}
                    </button>
                  </div>

                  {/* Header info */}
                  <div className="mb-6 pb-6 border-b border-gray-800">
                    <h3 className="text-2xl font-bold text-white">
                      {currentPosting.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-400">
                      <span>{currentPosting.company}</span>
                      <span>&middot;</span>
                      <span>{currentPosting.location}</span>
                      <span>&middot;</span>
                      <span className="capitalize">
                        {currentPosting.workMode}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Tag label={currentPosting.employmentType} />
                      <Tag label={currentPosting.experienceLevel} />
                      <Tag label={currentPosting.department} />
                      {currentPosting.salaryRange && (
                        <Tag label={currentPosting.salaryRange} />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <Section title="About the Role">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {currentPosting.description}
                    </p>
                  </Section>

                  <Section title="Responsibilities">
                    <ul className="space-y-2">
                      {currentPosting.responsibilities.map((r, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-gray-300"
                        >
                          <span className="text-sky-400 mt-0.5 shrink-0">
                            &bull;
                          </span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section title="Qualifications">
                    <ul className="space-y-2">
                      {currentPosting.qualifications.map((q, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-gray-300"
                        >
                          <span className="text-sky-400 mt-0.5 shrink-0">
                            &bull;
                          </span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section title="Nice to Have">
                    <ul className="space-y-2">
                      {currentPosting.niceToHaves.map((n, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-gray-300"
                        >
                          <span className="text-gray-500 mt-0.5 shrink-0">
                            &bull;
                          </span>
                          {n}
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section title="Benefits">
                    <ul className="space-y-2">
                      {currentPosting.benefits.map((b, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-gray-300"
                        >
                          <span className="text-green-400 mt-0.5 shrink-0">
                            &bull;
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-sky-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Create Your First Job Posting
                </h3>
                <p className="text-sm text-gray-400 max-w-md">
                  Fill in the role details on the left and click
                  &ldquo;Generate&rdquo; to create an inclusive,
                  bias-free job description.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- Helper Components --- */

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block bg-sky-500/10 text-sky-300 text-xs font-medium px-2.5 py-1 rounded-full border border-sky-500/20 capitalize">
      {label}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}

function formatPostingAsText(p: JobPosting): string {
  const lines = [
    p.title,
    `${p.company} | ${p.location} | ${p.workMode}`,
    `${p.employmentType} | ${p.experienceLevel}`,
    p.salaryRange ? `Salary: ${p.salaryRange}` : "",
    "",
    "ABOUT THE ROLE",
    p.description,
    "",
    "RESPONSIBILITIES",
    ...p.responsibilities.map((r) => `- ${r}`),
    "",
    "QUALIFICATIONS",
    ...p.qualifications.map((q) => `- ${q}`),
    "",
    "NICE TO HAVE",
    ...p.niceToHaves.map((n) => `- ${n}`),
    "",
    "BENEFITS",
    ...p.benefits.map((b) => `- ${b}`),
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}
