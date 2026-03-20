import { NextRequest, NextResponse } from "next/server";
import { grants } from "@/lib/grants";
import { filterGrants } from "@/lib/matcher";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const industry = searchParams.get("industry") || undefined;
  const state = searchParams.get("state") || undefined;
  const maxEmployees = searchParams.get("maxEmployees")
    ? parseInt(searchParams.get("maxEmployees")!)
    : undefined;
  const minorityOwned = searchParams.get("minorityOwned") === "true" || undefined;
  const womenOwned = searchParams.get("womenOwned") === "true" || undefined;
  const veteranOwned = searchParams.get("veteranOwned") === "true" || undefined;
  const category = searchParams.get("category") || undefined;

  const hasFilters = industry || state || maxEmployees || minorityOwned || womenOwned || veteranOwned || category;

  if (!hasFilters) {
    return NextResponse.json({ grants, total: grants.length });
  }

  const filtered = filterGrants(grants, {
    industry,
    state,
    maxEmployees,
    minorityOwned,
    womenOwned,
    veteranOwned,
    category,
  });

  return NextResponse.json({ grants: filtered, total: filtered.length });
}
