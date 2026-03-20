import { NextRequest, NextResponse } from "next/server";
import { getJobById } from "../../../store";
import { analyzeJobPosting } from "../../../generate";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const job = getJobById(params.id);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const analysis = analyzeJobPosting(job);

  // Update in place
  job.biasWarnings = analysis.biasWarnings;
  job.inclusivityScore = analysis.inclusivityScore;

  return NextResponse.json({
    id: job.id,
    biasWarnings: analysis.biasWarnings,
    inclusivityScore: analysis.inclusivityScore,
  });
}
