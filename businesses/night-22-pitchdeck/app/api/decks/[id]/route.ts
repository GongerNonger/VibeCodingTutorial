import { NextRequest, NextResponse } from 'next/server';
import { getDeck } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deck = getDeck(params.id);

  if (!deck) {
    return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
  }

  return NextResponse.json(deck);
}
