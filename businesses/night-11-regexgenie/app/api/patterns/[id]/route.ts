import { NextRequest, NextResponse } from "next/server";
import { getPattern } from "../../store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const pattern = getPattern(params.id);

  if (!pattern) {
    return NextResponse.json(
      { error: "Pattern not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(pattern);
}
