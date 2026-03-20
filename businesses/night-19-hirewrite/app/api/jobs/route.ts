import { NextRequest, NextResponse } from "next/server";
import { getAllJobs, addJob } from "../store";
import { generateJobPosting } from "../generate";

export async function GET() {
  const jobs = getAllJobs();
  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();

    // Validate required fields
    const required = ["title", "company", "location", "workMode", "employmentType", "experienceLevel", "department"];
    const missing = required.filter((f) => !input[f] || String(input[f]).trim() === "");
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const posting = generateJobPosting({
      title: input.title,
      company: input.company,
      location: input.location,
      workMode: input.workMode,
      employmentType: input.employmentType,
      experienceLevel: input.experienceLevel,
      salaryRange: input.salaryRange || "",
      department: input.department,
      notes: input.notes || "",
    });

    addJob(posting);
    return NextResponse.json(posting, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
