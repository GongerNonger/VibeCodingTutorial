import { NextRequest, NextResponse } from "next/server";

export interface ChangelogEntry {
  id: string;
  title: string;
  date: string;
  version: string;
  type: "feature" | "fix" | "improvement" | "breaking";
  description: string;
  details: string;
}

const validTypes = ["feature", "fix", "improvement", "breaking"];

const entries: ChangelogEntry[] = [
  {
    id: "seed-1",
    title: "Dark Mode Support",
    date: "2026-03-18",
    version: "v2.1.0",
    type: "feature",
    description: "Added full dark mode support across all pages and components.",
    details: "- Automatic detection of system preference\n- Manual toggle in settings\n- Persists selection in localStorage\n- All components updated with dark variants",
  },
  {
    id: "seed-2",
    title: "Fix CSV Export Encoding",
    date: "2026-03-15",
    version: "v2.0.1",
    type: "fix",
    description: "Resolved UTF-8 encoding issues when exporting data to CSV.",
    details: "- Added BOM header for Excel compatibility\n- Fixed special character escaping\n- Added unit tests for export edge cases",
  },
  {
    id: "seed-3",
    title: "API v1 Deprecation",
    date: "2026-03-10",
    version: "v2.0.0",
    type: "breaking",
    description: "Removed legacy API v1 endpoints. All clients must migrate to v2.",
    details: "- /api/v1/* endpoints removed\n- Authentication now uses Bearer tokens only\n- Rate limiting changed from 100/min to 60/min\n- See migration guide at docs.example.com/migrate",
  },
];

export async function GET() {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json({ entries: sorted });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, date, version, type, description, details } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!date || typeof date !== "string") {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    if (!version || typeof version !== "string" || !version.trim()) {
      return NextResponse.json({ error: "Version is required" }, { status: 400 });
    }
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ error: `Type must be one of: ${validTypes.join(", ")}` }, { status: 400 });
    }
    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    const entry: ChangelogEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      date,
      version: version.trim(),
      type,
      description: description.trim(),
      details: typeof details === "string" ? details.trim() : "",
    };

    entries.push(entry);

    return NextResponse.json({ entry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
