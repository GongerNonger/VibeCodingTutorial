import { NextResponse } from "next/server";
import { getInstitutionalAnalytics } from "../advisor";

export async function GET() {
  const analytics = getInstitutionalAnalytics();
  return NextResponse.json({ analytics });
}
