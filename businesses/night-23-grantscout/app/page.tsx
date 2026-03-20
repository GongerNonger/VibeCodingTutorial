"use client";

import { useState } from "react";

interface Grant {
  id: string;
  name: string;
  agency: string;
  description: string;
  amountMin: number;
  amountMax: number;
  deadline: string;
  eligibility: {
    industries: string[];
    maxEmployees: number | null;
    maxRevenue: number | null;
    states: string[] | "all";
    requiresMinority: boolean;
    requiresWomen: boolean;
    requiresVeteran: boolean;
  };
  url: string;
  tips: string[];
  commonQuestions: string[];
  category: string;
}

interface GrantMatch {
  grant: Grant;
  score: number;
  reasons: string[];
}

interface DraftResponse {
  question: string;
  answer: string;
}

type Tab = "profile" | "matches" | "browse" | "bookmarks";

const INDUSTRIES = [
  "Technology",
  "Retail",
  "Manufacturing",
  "Healthcare",
  "Food",
  "Services",
  "Construction",
  "Agriculture",
  "Energy",
  "Education",
  "Nonprofit",
];

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

function formatMoney(amount: number): string {
  if (amount >= 1000000) return "$" + (amount / 1000000).toFixed(1) + "M";
  if (amount >= 1000) return "$" + (amount / 1000).toFixed(0) + "K";
  return "$" + amount;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile state
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [state, setState] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [minorityOwned, setMinorityOwned] = useState(false);
  const [womenOwned, setWomenOwned] = useState(false);
  const [veteranOwned, setVeteranOwned] = useState(false);
  const [description, setDescription] = useState("");

  // Results state
  const [matches, setMatches] = useState<GrantMatch[]>([]);
  const [allGrants, setAllGrants] = useState<Grant[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [drafts, setDrafts] = useState<DraftResponse[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Browse filters
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const getProfile = () => ({
    id: "",
    name,
    industry,
    state,
    employeeCount: parseInt(employeeCount) || 0,
    annualRevenue: parseInt(annualRevenue) || 0,
    minorityOwned,
    womenOwned,
    veteranOwned,
    description,
  });

  const handleFindGrants = async () => {
    if (!industry || !state) return;
    setLoading(true);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getProfile()),
      });
      const data = await res.json();
      setMatches(data.matches || []);
      setActiveTab("matches");
    } catch (err) {
      console.error("Match error:", err);
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!name || !industry || !state) return;
    try {
      await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getProfile()),
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleBrowseGrants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterIndustry) params.set("industry", filterIndustry);
      if (filterCategory) params.set("category", filterCategory);
      const res = await fetch(`/api/grants?${params.toString()}`);
      const data = await res.json();
      setAllGrants(data.grants || []);
    } catch (err) {
      console.error("Browse error:", err);
    }
    setLoading(false);
  };

  const handleGenerateDraft = async (grant: Grant) => {
    if (!name || !industry || !state) {
      setActiveTab("profile");
      return;
    }
    setDraftLoading(true);
    setSelectedGrant(grant);
    setDrafts([]);
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grantId: grant.id, profile: getProfile() }),
      });
      const data = await res.json();
      setDrafts(data.drafts || []);
    } catch (err) {
      console.error("Draft error:", err);
    }
    setDraftLoading(false);
  };

  const toggleBookmark = (grantId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(grantId)) next.delete(grantId);
      else next.add(grantId);
      return next;
    });
  };

  const bookmarkedGrants = matches
    .map((m) => m.grant)
    .concat(allGrants)
    .filter((g, i, arr) => arr.findIndex((x) => x.id === g.id) === i)
    .filter((g) => bookmarks.has(g.id));

  const renderGrantCard = (grant: Grant, score?: number, reasons?: string[]) => (
    <div
      key={grant.id}
      className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-teal-500 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-teal-400">{grant.name}</h3>
          <p className="text-sm text-gray-400">{grant.agency}</p>
        </div>
        <div className="flex items-center gap-2">
          {score !== undefined && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                score >= 70
                  ? "bg-teal-500/20 text-teal-300"
                  : score >= 40
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-gray-600/20 text-gray-300"
              }`}
            >
              {score}% match
            </span>
          )}
          <button
            onClick={() => toggleBookmark(grant.id)}
            className={`text-xl ${
              bookmarks.has(grant.id) ? "text-teal-400" : "text-gray-500"
            } hover:text-teal-300`}
            title={bookmarks.has(grant.id) ? "Remove bookmark" : "Bookmark"}
          >
            {bookmarks.has(grant.id) ? "\u2605" : "\u2606"}
          </button>
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-3">{grant.description}</p>
      <div className="flex flex-wrap gap-3 mb-3">
        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
          {formatMoney(grant.amountMin)} - {formatMoney(grant.amountMax)}
        </span>
        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
          Deadline: {grant.deadline}
        </span>
        <span className="bg-gray-700 text-teal-300 px-2 py-1 rounded text-xs">
          {grant.category}
        </span>
      </div>
      {reasons && reasons.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Why you match:</p>
          <div className="flex flex-wrap gap-1">
            {reasons.map((r, i) => (
              <span key={i} className="text-xs bg-teal-900/40 text-teal-300 px-2 py-0.5 rounded">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mb-3">
        <p className="text-xs text-gray-400 mb-1">Application Tips:</p>
        <ul className="text-xs text-gray-300 list-disc pl-4 space-y-1">
          {grant.tips.slice(0, 2).map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleGenerateDraft(grant)}
          className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded transition-colors"
        >
          Draft Application
        </button>
        <a
          href={grant.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm px-4 py-2 rounded transition-colors"
        >
          Learn More
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-teal-400">GrantScout</h1>
              <p className="text-gray-400 text-sm">
                Small Business Grant Finder & Application Helper
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="bg-teal-900/40 text-teal-300 px-3 py-1 rounded">
                Free: Grant Matching
              </span>
              <span className="bg-teal-600 text-white px-3 py-1 rounded">
                Pro $49/mo: AI Drafting
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {(
            [
              ["profile", "Business Profile"],
              ["matches", `Matches (${matches.length})`],
              ["browse", "Browse Grants"],
              ["bookmarks", `Saved (${bookmarks.size})`],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as Tab);
                if (tab === "browse" && allGrants.length === 0) handleBrowseGrants();
              }}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-teal-500 text-teal-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Tell us about your business
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                  placeholder="Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:border-teal-500 outline-none"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:border-teal-500 outline-none"
                  >
                    <option value="">Select state</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:border-teal-500 outline-none"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Annual Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:border-teal-500 outline-none"
                    placeholder="500000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Demographics
                </label>
                <div className="flex gap-4">
                  {[
                    ["Minority-Owned", minorityOwned, setMinorityOwned],
                    ["Women-Owned", womenOwned, setWomenOwned],
                    ["Veteran-Owned", veteranOwned, setVeteranOwned],
                  ].map(([label, value, setter]) => (
                    <label
                      key={label as string}
                      className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) =>
                          (setter as (v: boolean) => void)(e.target.checked)
                        }
                        className="rounded bg-gray-700 border-gray-600 text-teal-500 focus:ring-teal-500"
                      />
                      {label as string}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Business Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:border-teal-500 outline-none"
                  placeholder="Brief description of what your business does..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleFindGrants}
                  disabled={!industry || !state || loading}
                  className="bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium px-6 py-2.5 rounded transition-colors"
                >
                  {loading ? "Searching..." : "Find Matching Grants"}
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={!name || !industry || !state}
                  className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-gray-200 font-medium px-6 py-2.5 rounded transition-colors"
                >
                  Save Profile
                </button>
                {profileSaved && (
                  <span className="text-teal-400 text-sm self-center">
                    Profile saved!
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === "matches" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Grant Matches
            </h2>
            {matches.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">No matches yet</p>
                <p className="text-sm">
                  Complete your business profile to find matching grants.
                </p>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="mt-4 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded text-sm"
                >
                  Go to Profile
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-sm mb-6">
                  Found {matches.length} grants matching your profile
                </p>
                <div className="space-y-4">
                  {matches.map((m) =>
                    renderGrantCard(m.grant, m.score, m.reasons)
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Browse Tab */}
        {activeTab === "browse" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Browse All Grants
            </h2>
            <div className="flex gap-3 mb-6">
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-teal-500 outline-none"
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i.toLowerCase()}>
                    {i}
                  </option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-teal-500 outline-none"
              >
                <option value="">All Categories</option>
                <option value="SBA">SBA</option>
                <option value="SBIR">SBIR/STTR</option>
                <option value="Minority">Minority-Owned</option>
                <option value="Women">Women-Owned</option>
                <option value="Veteran">Veteran-Owned</option>
                <option value="State">State Grants</option>
                <option value="Federal">Federal</option>
              </select>
              <button
                onClick={handleBrowseGrants}
                className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded"
              >
                Filter
              </button>
            </div>
            {loading ? (
              <p className="text-gray-400">Loading grants...</p>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Showing {allGrants.length} grants
                </p>
                {allGrants.map((g) => renderGrantCard(g))}
              </div>
            )}
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === "bookmarks" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Saved Grants
            </h2>
            {bookmarkedGrants.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">No saved grants</p>
                <p className="text-sm">
                  Click the star icon on any grant to save it for later.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarkedGrants.map((g) => renderGrantCard(g))}
              </div>
            )}
          </div>
        )}

        {/* Draft Modal */}
        {selectedGrant && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-teal-400">
                    Application Draft
                  </h3>
                  <p className="text-sm text-gray-400">{selectedGrant.name}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedGrant(null);
                    setDrafts([]);
                  }}
                  className="text-gray-400 hover:text-gray-200 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              {draftLoading ? (
                <div className="text-center py-8 text-gray-400">
                  Generating application drafts...
                </div>
              ) : (
                <div className="space-y-6">
                  {drafts.map((d, i) => (
                    <div key={i}>
                      <h4 className="text-sm font-medium text-teal-300 mb-2">
                        Q: {d.question}
                      </h4>
                      <div className="bg-gray-800 border border-gray-700 rounded p-4 text-sm text-gray-200 leading-relaxed">
                        {d.answer}
                      </div>
                    </div>
                  ))}
                  {drafts.length > 0 && (
                    <p className="text-xs text-gray-500 italic">
                      These drafts are generated as starting points. Review and
                      customize before submitting your application.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
