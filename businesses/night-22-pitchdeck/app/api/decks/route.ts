import { NextResponse } from "next/server";
import { getAllDecks, addDeck } from "../store";
import { generateDeck } from "../generate";

export async function GET() {
  const decks = getAllDecks();
  const summary = decks.map((d) => ({
    id: d.id,
    companyName: d.companyName,
    industry: d.industry,
    stage: d.stage,
    slideCount: d.slides.length,
    createdAt: d.createdAt,
  }));
  return NextResponse.json(summary);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, industry, problem, solution, targetMarket, businessModel, fundingAsk, teamSize, stage } = body;

    if (!companyName || !industry || !problem || !solution || !targetMarket || !businessModel || !fundingAsk || !teamSize || !stage) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const deck = generateDeck({
      companyName,
      industry,
      problem,
      solution,
      targetMarket,
      businessModel,
      fundingAsk,
      teamSize: Number(teamSize),
      stage,
    });

    addDeck(deck);
    return NextResponse.json(deck);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
