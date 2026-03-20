import { NextResponse } from "next/server";
import { getAnalyses } from "../store";

export async function GET() {
  const analyses = getAnalyses();
  return NextResponse.json(analyses);
}
