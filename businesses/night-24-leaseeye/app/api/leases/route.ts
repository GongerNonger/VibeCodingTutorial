import { NextResponse } from "next/server";
import { getAnalyses, addAnalysis } from "../store";
import { analyzeLease } from "../analyze";

export async function GET() {
  const analyses = getAnalyses();
  return NextResponse.json(analyses);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leaseText } = body;

    if (!leaseText || typeof leaseText !== "string" || leaseText.trim().length === 0) {
      return NextResponse.json({ error: "Lease text is required" }, { status: 400 });
    }

    const analysis = analyzeLease(leaseText.trim());
    addAnalysis(analysis);

    return NextResponse.json(analysis, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
