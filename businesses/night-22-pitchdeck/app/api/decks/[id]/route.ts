import { NextResponse } from "next/server";
import { getDeckById } from "../../store";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const deck = getDeckById(params.id);
  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }
  return NextResponse.json(deck);
}
