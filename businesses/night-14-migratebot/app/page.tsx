"use client";

import { useState, useEffect, useCallback } from "react";

interface GeneratedMigration {
  up: string;
  down: string;
  warnings: string[];
  filename: string;
}

interface Migration {
  id: string;
  description: string;
  orm: string;
  database: string;
  createdAt: string;
  generated: GeneratedMigration | null;
}

const ORM_OPTIONS = [
  { value: "prisma", label: "Prisma" },
  { value: "drizzle", label: "Drizzle" },
  { value: "knex", label: "Knex" },
  { value: "typeorm", label: "TypeORM" },
  { value: "raw-sql", label: "Raw SQL" },
];

const DB_OPTIONS = [
  { value: "postgres", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
];

const ORM_COLORS: Record<string, string> = {
  prisma: "bg-indigo-600",
  drizzle: "bg-green-600",
  knex: "bg-orange-600",
  typeorm: "bg-red-600",
  "raw-sql": "bg-gray-600",
};

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
          {label}
        </span>
        <button
          onClick={copy}
          className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors cursor-pointer"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
}

function SchemaVisualization({ description }: { description: string }) {
  const desc = description.toLowerCase();
  let visualization = "";

  const createMatch = desc.match(
    /create\s+(?:a\s+)?(?:table\s+)?(\w+)\s+(?:table\s+)?(?:with\s+(?:columns?\s+)?)?(.+)/i
  );
  if (createMatch) {
    const table =
      createMatch[1] === "table"
        ? description.match(/table\s+(\w+)/i)?.[1] || "unknown"
        : createMatch[1];
    const cols = createMatch[2].split(/,\s*/);
    const bar = "\u2500".repeat(30);
    visualization = `+${bar}+\n| ${table.toUpperCase().padEnd(28)} |\n+${bar}+\n${cols.map((c) => `| ${c.trim().padEnd(28)} |`).join("\n")}\n+${bar}+`;
  } else if (desc.includes("add column") || desc.includes("add ")) {
    const addMatch = desc.match(
      /add\s+(?:column\s+)?(\w+)\s+to\s+(?:table\s+)?(\w+)/i
    );
    if (addMatch) {
      visualization = `${addMatch[2].toUpperCase()}\n  ... existing columns ...\n  + ${addMatch[1]} (new)`;
    }
  } else if (desc.includes("rename")) {
    const renameMatch = desc.match(
      /rename\s+(?:column\s+)?(\w+)\s+to\s+(\w+)\s+(?:in|on)\s+(?:table\s+)?(\w+)/i
    );
    if (renameMatch) {
      visualization = `${renameMatch[3].toUpperCase()}\n  ${renameMatch[1]} --> ${renameMatch[2]}`;
    }
  } else if (desc.includes("drop")) {
    const dropMatch = desc.match(/drop\s+(?:table\s+)?(\w+)/i);
    if (dropMatch) {
      const table =
        dropMatch[1] === "table"
          ? description.match(/table\s+(\w+)/i)?.[1] || "unknown"
          : dropMatch[1];
      visualization = `[DROPPED] ${table.toUpperCase()}`;
    }
  } else if (desc.includes("index")) {
    const indexMatch = desc.match(
      /index\s+(?:on|to)\s+(?:table\s+)?(\w+)/i
    );
    if (indexMatch) {
      visualization = `${indexMatch[1].toUpperCase()}\n  + INDEX added`;
    }
  }

  if (!visualization) return null;

  return (
    <div className="mt-3">
      <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
        Schema Change
      </span>
      <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm font-mono text-teal-300 mt-1">
        {visualization}
      </pre>
    </div>
  );
}

export default function Home() {
  const [description, setDescription] = useState("");
  const [orm, setOrm] = useState("prisma");
  const [database, setDatabase] = useState("postgres");
  const [migrations, setMigrations] = useState<Migration[]>([]);
  const [selected, setSelected] = useState<Migration | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchMigrations = useCallback(async () => {
    const res = await fetch("/api/migrations");
    const data = await res.json();
    setMigrations(data);
  }, []);

  useEffect(() => {
    fetchMigrations();
  }, [fetchMigrations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);

    const res = await fetch("/api/migrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: description.trim(), orm, database }),
    });
    const migration = await res.json();

    // Auto-generate
    setGenerating(true);
    const genRes = await fetch(`/api/migrations/${migration.id}/generate`, {
      method: "POST",
    });
    const updated = await genRes.json();

    setSelected(updated);
    setDescription("");
    setLoading(false);
    setGenerating(false);
    fetchMigrations();
  };

  const handleSelect = async (m: Migration) => {
    if (m.generated) {
      setSelected(m);
      return;
    }
    setGenerating(true);
    const res = await fetch(`/api/migrations/${m.id}/generate`, {
      method: "POST",
    });
    const updated = await res.json();
    setSelected(updated);
    setGenerating(false);
    fetchMigrations();
  };

  const copyFullMigration = () => {
    if (!selected?.generated) return;
    const text = `-- UP Migration\n${selected.generated.up}\n\n-- DOWN Migration\n${selected.generated.down}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-gray-950 text-lg">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MigrateBot</h1>
              <p className="text-xs text-gray-500">
                Describe schema changes, get migration files
              </p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
            $19/mo
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form + History */}
          <div className="lg:col-span-1 space-y-6">
            {/* Migration Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-gray-900 rounded-xl border border-gray-800 p-5"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                New Migration
              </h2>

              <label className="block text-sm font-medium text-gray-400 mb-1">
                Describe your schema change
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='e.g. "Add email column to users table" or "Create posts table with title, body, author_id, published_at"'
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none mb-3"
              />

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    ORM
                  </label>
                  <select
                    value={orm}
                    onChange={(e) => setOrm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {ORM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Database
                  </label>
                  <select
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {DB_OPTIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                {loading
                  ? generating
                    ? "Generating..."
                    : "Creating..."
                  : "Generate Migration"}
              </button>
            </form>

            {/* Migration History */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="text-lg font-semibold text-white mb-4">
                Migration History
              </h2>
              {migrations.length === 0 ? (
                <p className="text-sm text-gray-500">No migrations yet</p>
              ) : (
                <div className="space-y-2">
                  {migrations.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelect(m)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                        selected?.id === m.id
                          ? "bg-gray-800 border-teal-500"
                          : "bg-gray-800/50 border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-medium text-white ${ORM_COLORS[m.orm] || "bg-gray-600"}`}
                        >
                          {m.orm}
                        </span>
                        <span className="text-xs text-gray-500">
                          {m.database}
                        </span>
                        {m.generated && (
                          <span className="text-xs text-teal-500 ml-auto">
                            generated
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {m.description}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Generated Code */}
          <div className="lg:col-span-2">
            {selected?.generated ? (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Generated Migration
                  </h2>
                  <button
                    onClick={copyFullMigration}
                    className="text-sm px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-gray-950 font-medium transition-colors cursor-pointer"
                  >
                    Copy Migration
                  </button>
                </div>

                {/* Filename */}
                <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-xs text-gray-500 block mb-1">
                    Suggested filename
                  </span>
                  <code className="text-sm text-teal-400 font-mono">
                    {selected.generated.filename}
                  </code>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Description
                  </span>
                  <p className="text-sm text-gray-300 mt-1">
                    {selected.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-medium text-white ${ORM_COLORS[selected.orm] || "bg-gray-600"}`}
                    >
                      {selected.orm}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">
                      {selected.database}
                    </span>
                  </div>
                </div>

                {/* Schema Visualization */}
                <SchemaVisualization description={selected.description} />

                {/* Warnings */}
                {selected.generated.warnings.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                      Warnings
                    </span>
                    <ul className="mt-1 space-y-1">
                      {selected.generated.warnings.map((w, i) => (
                        <li
                          key={i}
                          className="text-sm text-yellow-300 flex items-start gap-2"
                        >
                          <span className="text-yellow-500 mt-0.5">!</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Blocks */}
                <CodeBlock code={selected.generated.up} label="Up Migration" />
                <CodeBlock
                  code={selected.generated.down}
                  label="Down Migration"
                />
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-teal-500">&#8693;</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {generating
                    ? "Generating migration..."
                    : "No migration selected"}
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  {generating
                    ? "Parsing your description and generating migration code..."
                    : "Describe a schema change in the form on the left, or select a migration from the history to view its generated code."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-600">
          MigrateBot &mdash; Night 14 of 25 &mdash; Overnight Business Factory
        </div>
      </footer>
    </div>
  );
}
