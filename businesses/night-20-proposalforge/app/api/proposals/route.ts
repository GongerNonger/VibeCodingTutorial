import { NextResponse } from "next/server";
import { getProposals } from "@/lib/store";

export async function GET() {
  const proposals = getProposals();
  return NextResponse.json({ proposals });
}
