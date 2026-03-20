import { NextResponse } from "next/server";
import { getAnalysisById } from "../../store";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const analysis = getAnalysisById(params.id);

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  return NextResponse.json(analysis);
}
