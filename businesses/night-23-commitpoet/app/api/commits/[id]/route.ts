import { NextRequest, NextResponse } from "next/server";
import { commitHistory } from "../../store";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const commitRequest = commitHistory.find((c) => c.id === params.id);

  if (!commitRequest) {
    return NextResponse.json(
      { error: "Commit request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ commitRequest });
}
