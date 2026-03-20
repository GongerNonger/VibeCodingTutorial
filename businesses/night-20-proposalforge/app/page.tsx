"use client";

import { useState, useCallback } from "react";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

interface Profile {
  name: string;
  title: string;
  skills: string;
  hourlyRate: number;
  portfolioUrl: string;
  email: string;
}

interface ProjectDetails {
  clientName: string;
  clientCompany: string;
  projectTitle: string;
  projectDescription: string;
  deliverables: string;
  deadline: string;
  pricingModel: "hourly" | "fixed";
}

type ProposalStyle = "minimal" | "professional" | "creative";

const defaultProfile: Profile = {
  name: "",
  title: "",
  skills: "",
  hourlyRate: 100,
  portfolioUrl: "",
  email: "",
};

const defaultProject: ProjectDetails = {
  clientName: "",
  clientCompany: "",
  projectTitle: "",
  projectDescription: "",
  deliverables: "",
  deadline: "",
  pricingModel: "fixed",
};

const defaultLineItem: LineItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
  unit: "hours",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function HomePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [project, setProject] = useState<ProjectDetails>(defaultProject);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { ...defaultLineItem },
  ]);
  const [style, setStyle] = useState<ProposalStyle>("professional");
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "proposal">("form");

  const totalPrice = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const addLineItem = () => {
    setLineItems([...lineItems, { ...defaultLineItem }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const handleGenerate = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const deliverables = project.deliverables
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean);

      if (!profile.name || !profile.title) {
        throw new Error("Please fill in your name and title.");
      }
      if (!project.clientName || !project.projectTitle) {
        throw new Error("Please fill in the client name and project title.");
      }
      if (deliverables.length === 0) {
        throw new Error("Please add at least one deliverable.");
      }
      if (lineItems.every((li) => !li.description)) {
        throw new Error("Please add at least one line item.");
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            id: "local",
            name: profile.name,
            title: profile.title,
            skills: profile.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            hourlyRate: profile.hourlyRate,
            portfolioUrl: profile.portfolioUrl,
            email: profile.email,
            createdAt: new Date().toISOString(),
          },
          project: {
            clientName: project.clientName,
            clientCompany: project.clientCompany,
            projectTitle: project.projectTitle,
            projectDescription: project.projectDescription,
            deliverables,
            deadline: project.deadline,
            pricingModel: project.pricingModel,
            lineItems: lineItems.filter((li) => li.description),
          },
          style,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate proposal");
      }

      const data = await res.json();
      setGeneratedProposal(data.fullText);
      setActiveTab("proposal");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [profile, project, lineItems, style]);

  const copyProposal = useCallback(async () => {
    if (generatedProposal) {
      await navigator.clipboard.writeText(generatedProposal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedProposal]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-black text-sm">
              PF
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">ProposalForge</h1>
              <p className="text-xs text-neutral-500">
                Proposal & Quote Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 hidden sm:inline">
              $9/mo for 10 proposals | $29/mo unlimited
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-neutral-900 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("form")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "form"
                ? "bg-cyan-500 text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Build Proposal
          </button>
          <button
            onClick={() => setActiveTab("proposal")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "proposal"
                ? "bg-cyan-500 text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            View Proposal{generatedProposal ? " *" : ""}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {activeTab === "form" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Profile Section */}
              <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-cyan-500 mb-4">
                  Your Profile
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        placeholder="Jane Smith"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) =>
                          setProfile({ ...profile, title: e.target.value })
                        }
                        placeholder="Full-Stack Developer"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={profile.skills}
                      onChange={(e) =>
                        setProfile({ ...profile, skills: e.target.value })
                      }
                      placeholder="React, TypeScript, Node.js, PostgreSQL"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        value={profile.hourlyRate}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            hourlyRate: Number(e.target.value),
                          })
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        placeholder="jane@example.com"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={profile.portfolioUrl}
                      onChange={(e) =>
                        setProfile({ ...profile, portfolioUrl: e.target.value })
                      }
                      placeholder="https://janesmith.dev"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Project Details */}
              <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-cyan-500 mb-4">
                  Project Details
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={project.clientName}
                        onChange={(e) =>
                          setProject({
                            ...project,
                            clientName: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={project.clientCompany}
                        onChange={(e) =>
                          setProject({
                            ...project,
                            clientCompany: e.target.value,
                          })
                        }
                        placeholder="Acme Corp"
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={project.projectTitle}
                      onChange={(e) =>
                        setProject({
                          ...project,
                          projectTitle: e.target.value,
                        })
                      }
                      placeholder="E-commerce Website Redesign"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Project Description
                    </label>
                    <textarea
                      value={project.projectDescription}
                      onChange={(e) =>
                        setProject({
                          ...project,
                          projectDescription: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Describe the project scope and goals..."
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Deliverables * (one per line)
                    </label>
                    <textarea
                      value={project.deliverables}
                      onChange={(e) =>
                        setProject({
                          ...project,
                          deliverables: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder={"Homepage redesign\nProduct catalog\nCheckout flow"}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={project.deadline}
                      onChange={(e) =>
                        setProject({ ...project, deadline: e.target.value })
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing */}
              <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-cyan-500 mb-4">
                  Pricing Calculator
                </h2>
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() =>
                      setProject({ ...project, pricingModel: "hourly" })
                    }
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      project.pricingModel === "hourly"
                        ? "bg-cyan-500 text-black font-medium"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    Hourly
                  </button>
                  <button
                    onClick={() =>
                      setProject({ ...project, pricingModel: "fixed" })
                    }
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      project.pricingModel === "fixed"
                        ? "bg-cyan-500 text-black font-medium"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    Fixed Price
                  </button>
                </div>

                <div className="space-y-3">
                  {lineItems.map((item, i) => (
                    <div
                      key={i}
                      className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-3"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(i, "description", e.target.value)
                            }
                            placeholder="Line item description"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                Qty
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateLineItem(
                                    i,
                                    "quantity",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                Unit
                              </label>
                              <select
                                value={item.unit}
                                onChange={(e) =>
                                  updateLineItem(i, "unit", e.target.value)
                                }
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                              >
                                <option value="hours">Hours</option>
                                <option value="units">Units</option>
                                <option value="fixed">Fixed</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                Rate ($)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  updateLineItem(
                                    i,
                                    "unitPrice",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLineItem(i)}
                          className="text-neutral-500 hover:text-red-400 text-lg mt-1"
                          title="Remove item"
                        >
                          x
                        </button>
                      </div>
                      <div className="text-right text-xs text-neutral-400 mt-2">
                        Subtotal: {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addLineItem}
                  className="mt-3 w-full py-2 border border-dashed border-neutral-700 rounded-lg text-sm text-neutral-400 hover:text-cyan-500 hover:border-cyan-500/50 transition-colors"
                >
                  + Add Line Item
                </button>

                <div className="mt-4 pt-4 border-t border-neutral-700 flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Total</span>
                  <span className="text-xl font-bold text-cyan-500">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </section>

              {/* Style Selector */}
              <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-cyan-500 mb-4">
                  Proposal Style
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      {
                        key: "minimal",
                        label: "Minimal",
                        desc: "Clean & concise",
                      },
                      {
                        key: "professional",
                        label: "Professional",
                        desc: "Detailed & formal",
                      },
                      {
                        key: "creative",
                        label: "Creative",
                        desc: "Vibrant & unique",
                      },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setStyle(s.key)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        style === s.key
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                      }`}
                    >
                      <div
                        className={`text-sm font-medium ${style === s.key ? "text-cyan-500" : "text-white"}`}
                      >
                        {s.label}
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {s.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-black font-semibold rounded-xl text-sm transition-colors"
              >
                {loading ? "Generating..." : "Generate Proposal"}
              </button>
            </div>
          </div>
        ) : (
          /* Proposal View */
          <div className="max-w-4xl mx-auto">
            {generatedProposal ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Generated Proposal
                  </h2>
                  <button
                    onClick={copyProposal}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-medium rounded-lg transition-colors"
                  >
                    {copied ? "Copied!" : "Copy Full Proposal"}
                  </button>
                </div>
                <pre className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-sm text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                  {generatedProposal}
                </pre>
              </div>
            ) : (
              <div className="text-center py-20 text-neutral-500">
                <div className="text-4xl mb-4">---</div>
                <p>No proposal generated yet.</p>
                <p className="text-sm mt-1">
                  Fill in the form and click &quot;Generate Proposal&quot; to get started.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-neutral-600">
          ProposalForge — Built with Next.js, Tailwind CSS, and TypeScript
        </div>
      </footer>
    </div>
  );
}
