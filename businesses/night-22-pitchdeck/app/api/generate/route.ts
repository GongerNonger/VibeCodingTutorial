import { NextRequest, NextResponse } from 'next/server';
import { generateDeck, StartupInput, DeckStyle } from '@/lib/generator';
import { saveDeck } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, industry, problem, solution, targetMarket, businessModel, traction, team, fundingAsk, style } = body;

    if (!name || !industry || !problem || !solution) {
      return NextResponse.json(
        { error: 'Missing required fields: name, industry, problem, solution' },
        { status: 400 }
      );
    }

    const input: StartupInput = {
      name,
      industry,
      problem,
      solution,
      targetMarket: targetMarket || 'General market',
      businessModel: businessModel || 'To be determined',
      traction: traction || '',
      team: team || '',
      fundingAsk: fundingAsk || '',
    };

    const deckStyle: DeckStyle = style || 'yc-style';
    const deck = generateDeck(input, deckStyle);
    saveDeck(deck);

    return NextResponse.json(deck);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
