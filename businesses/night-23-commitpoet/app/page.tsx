"use client";

import { useState, useCallback } from "react";

interface Persona {
  id: string;
  name: string;
  description: string;
}

interface GeneratedMessage {
  personaId: string;
  personaName: string;
  message: string;
}

interface DiffAnalysis {
  filesChanged: string[];
  linesAdded: number;
  linesRemoved: number;
  changeTypes: string[];
  languages: string[];
  detectedChanges: string[];
}

interface CommitRequest {
  id: string;
  diff: string;
  persona: string | null;
  generatedMessages: GeneratedMessage[];
  createdAt: string;
}

const DEFAULT_PERSONAS: Persona[] = [
  { id: "professional", name: "Professional", description: "Clean conventional commits" },
  { id: "pirate", name: "Pirate", description: "Arr matey! Swashbuckling style" },
  { id: "shakespeare", name: "Shakespeare", description: "Ye olde English prose" },
  { id: "emoji-master", name: "Emoji Master", description: "Heavy emoji usage" },
  { id: "haiku", name: "Haiku", description: "5-7-5 syllable format" },
  { id: "senior-dev", name: "Senior Dev", description: "Dry humor, concise" },
];

const SAMPLE_DIFF = `diff --git a/src/auth.ts b/src/auth.ts
index 1234567..abcdefg 100644
--- a/src/auth.ts
+++ b/src/auth.ts
@@ -10,6 +10,15 @@ import { hash } from './utils';
+export async function validateToken(token: string): Promise<boolean> {
+  if (!token) return false;
+  const decoded = decodeJWT(token);
+  if (decoded.exp < Date.now() / 1000) return false;
+  return true;
+}
+
 export function login(email: string, password: string) {
-  const user = findUser(email);
+  const user = await findUser(email);
+  if (!user) throw new AuthError('User not found');
   const valid = await compare(password, user.hash);`;

export default function Home() {
  const [diff, setDiff] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [messages, setMessages] = useState<GeneratedMessage[]>([]);
  const [analysis, setAnalysis] = useState<DiffAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<CommitRequest[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!diff.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/commits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff, persona: selectedPersona }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate");
        return;
      }
      setMessages(data.commitRequest.generatedMessages);
      setAnalysis(data.analysis);
      setHistory((prev) => [data.commitRequest, ...prev].slice(0, 20));
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, [diff, selectedPersona]);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const loadFromHistory = useCallback((item: CommitRequest) => {
    setDiff(item.diff);
    setMessages(item.generatedMessages);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Commit<span className="text-fuchsia-500">Poet</span>
              </h1>
              <p className="text-xs text-gray-500">Creative git commit messages</p>
            </div>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">Paste a diff. Pick a persona. Get poetry.</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diff Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Paste your git diff
                </label>
                <button
                  onClick={() => setDiff(SAMPLE_DIFF)}
                  className="text-xs text-fuchsia-500 hover:text-fuchsia-400 transition-colors"
                >
                  Load sample diff
                </button>
              </div>
              <textarea
                value={diff}
                onChange={(e) => setDiff(e.target.value)}
                placeholder="git diff output goes here..."
                className="w-full h-64 bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/30 resize-y"
                spellCheck={false}
              />
            </div>

            {/* Persona Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">
                  Choose a persona
                </label>
                <button
                  onClick={() => setSelectedPersona(null)}
                  className={`text-xs transition-colors ${
                    selectedPersona === null
                      ? "text-fuchsia-500"
                      : "text-gray-500 hover:text-gray-400"
                  }`}
                >
                  All personas
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DEFAULT_PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() =>
                      setSelectedPersona(
                        selectedPersona === persona.id ? null : persona.id
                      )
                    }
                    className={`text-left p-3 rounded-lg border transition-all ${
                      selectedPersona === persona.id
                        ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-300"
                        : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-gray-300"
                    }`}
                  >
                    <div className="text-sm font-medium">{persona.name}</div>
                    <div className="text-xs opacity-70 mt-0.5">
                      {persona.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading || !diff.trim()}
              className="w-full py-3 px-6 bg-fuchsia-500 hover:bg-fuchsia-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>Generate Commit Messages</>
              )}
            </button>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Diff Analysis */}
            {analysis && (
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Diff Analysis
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2 rounded bg-gray-800/50">
                    <div className="text-lg font-bold text-fuchsia-400">
                      {analysis.filesChanged.length}
                    </div>
                    <div className="text-xs text-gray-500">Files Changed</div>
                  </div>
                  <div className="p-2 rounded bg-gray-800/50">
                    <div className="text-lg font-bold text-green-400">
                      +{analysis.linesAdded}
                    </div>
                    <div className="text-xs text-gray-500">Lines Added</div>
                  </div>
                  <div className="p-2 rounded bg-gray-800/50">
                    <div className="text-lg font-bold text-red-400">
                      -{analysis.linesRemoved}
                    </div>
                    <div className="text-xs text-gray-500">Lines Removed</div>
                  </div>
                  <div className="p-2 rounded bg-gray-800/50">
                    <div className="text-lg font-bold text-fuchsia-400">
                      {analysis.changeTypes.join(", ") || "unknown"}
                    </div>
                    <div className="text-xs text-gray-500">Change Type</div>
                  </div>
                </div>
                {analysis.languages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {analysis.languages.map((lang) => (
                      <span
                        key={lang}
                        className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Generated Messages */}
            {messages.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">
                  Generated Messages ({messages.length})
                </h3>
                {messages.map((msg, i) => (
                  <div
                    key={`${msg.personaId}-${i}`}
                    className="p-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-2">
                          {msg.personaName}
                        </span>
                        <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
                          {msg.message}
                        </pre>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(msg.message, `${msg.personaId}-${i}`)
                        }
                        className="flex-shrink-0 p-2 rounded-md bg-gray-800 hover:bg-fuchsia-500/20 hover:text-fuchsia-400 text-gray-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Copy to clipboard"
                      >
                        {copiedId === `${msg.personaId}-${i}` ? (
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: History */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">History</h3>
            {history.length === 0 ? (
              <div className="p-6 rounded-lg bg-gray-900 border border-gray-800 text-center">
                <p className="text-sm text-gray-500">
                  No generations yet. Paste a diff and hit generate!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-3 rounded-lg bg-gray-900 border border-gray-800 hover:border-fuchsia-500/30 transition-colors"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-gray-300 truncate font-mono">
                      {item.generatedMessages[0]?.message.slice(0, 60) || "..."}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.generatedMessages.length} message
                      {item.generatedMessages.length !== 1 ? "s" : ""}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Sponsorship / Premium CTA */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/20">
              <h4 className="text-sm font-medium text-fuchsia-400 mb-1">
                Premium Personas
              </h4>
              <p className="text-xs text-gray-400 mb-3">
                Unlock Villain Monologue, Corporate Buzzword, and 10 more
                creative personas.
              </p>
              <button className="w-full py-2 px-4 rounded-md bg-fuchsia-500/20 text-fuchsia-400 text-sm font-medium hover:bg-fuchsia-500/30 transition-colors border border-fuchsia-500/30">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-gray-600">
          CommitPoet - Night 23 of 25 - Overnight Business Factory
        </div>
      </footer>
    </div>
  );
}
