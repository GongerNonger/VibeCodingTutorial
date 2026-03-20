"use client";

import { useState } from "react";

interface PacketSections {
  welcomeLetter: string;
  firstWeekSchedule: string;
  roleExpectations: string;
  cultureOverview: string;
  itSetupChecklist: string;
  hrFormsChecklist: string;
}

const sectionLabels: Record<keyof PacketSections, string> = {
  welcomeLetter: "Welcome Letter",
  firstWeekSchedule: "First Week Schedule",
  roleExpectations: "Role Expectations",
  cultureOverview: "Culture Overview",
  itSetupChecklist: "IT Setup Checklist",
  hrFormsChecklist: "HR Forms Checklist",
};

export default function Home() {
  const [step, setStep] = useState<"company" | "role" | "result">("company");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Company form state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [cultureValues, setCultureValues] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");

  // Role form state
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [manager, setManager] = useState("");
  const [startDate, setStartDate] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  // Result state
  const [sections, setSections] = useState<PacketSections | null>(null);
  const [editingSection, setEditingSection] = useState<keyof PacketSections | null>(null);
  const [editValue, setEditValue] = useState("");
  const [activeSection, setActiveSection] = useState<keyof PacketSections>("welcomeLetter");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: {
            name: companyName,
            industry,
            size,
            cultureValues,
            dressCode,
            toolsUsed,
          },
          role: {
            title: roleTitle,
            department,
            manager,
            startDate,
            responsibilities,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSections(data.sections);
        setStep("result");
      } else {
        alert(data.error || "Failed to generate packet");
      }
    } catch {
      alert("Failed to generate packet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyFullPacket = () => {
    if (!sections) return;
    const full = Object.entries(sections)
      .map(
        ([key, val]) =>
          `${"=".repeat(60)}\n${sectionLabels[key as keyof PacketSections].toUpperCase()}\n${"=".repeat(60)}\n\n${val}`
      )
      .join("\n\n\n");
    copyToClipboard(full, "full");
  };

  const startEditing = (key: keyof PacketSections) => {
    setEditingSection(key);
    setEditValue(sections![key]);
  };

  const saveEdit = () => {
    if (editingSection && sections) {
      setSections({ ...sections, [editingSection]: editValue });
      setEditingSection(null);
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditValue("");
  };

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-gray-950 text-lg">
              OK
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">OnboardKit</h1>
              <p className="text-xs text-gray-400">
                AI Employee Onboarding Document Generator
              </p>
            </div>
          </div>
          {step !== "company" && (
            <button
              onClick={() => {
                setStep("company");
                setSections(null);
              }}
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              + New Packet
            </button>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {["Company Info", "Role Details", "Generated Packet"].map(
            (label, i) => {
              const stepKeys = ["company", "role", "result"] as const;
              const isActive = stepKeys[i] === step;
              const isCompleted = stepKeys.indexOf(step) > i;
              return (
                <div key={label} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={`w-12 h-px ${
                        isCompleted || isActive
                          ? "bg-amber-500"
                          : "bg-gray-700"
                      }`}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isActive
                          ? "bg-amber-500 text-gray-950"
                          : isCompleted
                            ? "bg-amber-500/20 text-amber-500 border border-amber-500"
                            : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {isCompleted ? "\u2713" : i + 1}
                    </div>
                    <span
                      className={`text-sm hidden sm:inline ${
                        isActive
                          ? "text-amber-500 font-medium"
                          : isCompleted
                            ? "text-gray-400"
                            : "text-gray-600"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Company Form */}
        {step === "company" && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Company Profile
            </h2>
            <p className="text-gray-400 mb-6">
              Tell us about your company to personalize the onboarding packet.
            </p>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Industry *
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Technology"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Company Size
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="50"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Culture Values
                </label>
                <input
                  type="text"
                  value={cultureValues}
                  onChange={(e) => setCultureValues(e.target.value)}
                  placeholder="Innovation, Collaboration, Integrity"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Dress Code
                  </label>
                  <input
                    type="text"
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    placeholder="Business Casual"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Tools Used
                  </label>
                  <input
                    type="text"
                    value={toolsUsed}
                    onChange={(e) => setToolsUsed(e.target.value)}
                    placeholder="Slack, Jira, Google Workspace"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep("role")}
                disabled={!companyName || !industry}
                className="mt-2 w-full bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-semibold py-3 rounded-lg transition-colors"
              >
                Continue to Role Details
              </button>
            </div>
          </div>
        )}

        {/* Role Form */}
        {step === "role" && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Role Details
            </h2>
            <p className="text-gray-400 mb-6">
              Provide details about the role for the new hire.
            </p>
            <div className="grid gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="Software Engineer"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Engineering"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Manager Name *
                  </label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Key Responsibilities
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="Write clean code, Review pull requests, Collaborate with product team"
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple responsibilities with commas
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep("company")}
                  className="px-6 py-3 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!roleTitle || !department || !manager || loading}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-semibold py-3 rounded-lg transition-colors"
                >
                  {loading ? "Generating Packet..." : "Generate Onboarding Packet"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {step === "result" && sections && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Onboarding Packet Ready
                </h2>
                <p className="text-gray-400 mt-1">
                  {roleTitle} at {companyName}
                </p>
              </div>
              <button
                onClick={copyFullPacket}
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                {copied === "full" ? "Copied!" : "Copy Full Packet"}
              </button>
            </div>

            {/* Section Tabs */}
            <div className="flex overflow-x-auto gap-1 mb-4 pb-1">
              {(Object.keys(sectionLabels) as (keyof PacketSections)[]).map(
                (key) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === key
                        ? "bg-amber-500 text-gray-950"
                        : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    {sectionLabels[key]}
                  </button>
                )
              )}
            </div>

            {/* Active Section Content */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
                <h3 className="font-semibold text-amber-500">
                  {sectionLabels[activeSection]}
                </h3>
                <div className="flex gap-2">
                  {editingSection !== activeSection && (
                    <>
                      <button
                        onClick={() => startEditing(activeSection)}
                        className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            sections[activeSection],
                            activeSection
                          )
                        }
                        className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-1.5 rounded-md transition-colors"
                      >
                        {copied === activeSection ? "Copied!" : "Copy"}
                      </button>
                    </>
                  )}
                  {editingSection === activeSection && (
                    <>
                      <button
                        onClick={saveEdit}
                        className="text-xs bg-amber-500 text-gray-950 font-medium px-3 py-1.5 rounded-md transition-colors hover:bg-amber-400"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="p-5">
                {editingSection === activeSection ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-y min-h-[400px]"
                    rows={20}
                  />
                ) : (
                  <pre className="text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    {sections[activeSection]}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Banner */}
        {step === "company" && (
          <div className="mt-10 bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Simple Pricing
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
              <div className="bg-gray-800 rounded-lg px-6 py-4 w-full sm:w-auto">
                <div className="text-2xl font-bold text-amber-500">$15</div>
                <div className="text-sm text-gray-400">per onboarding packet</div>
              </div>
              <div className="text-gray-600 font-medium">or</div>
              <div className="bg-gray-800 rounded-lg px-6 py-4 border border-amber-500/30 w-full sm:w-auto">
                <div className="text-2xl font-bold text-amber-500">$39/mo</div>
                <div className="text-sm text-gray-400">unlimited packets</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
