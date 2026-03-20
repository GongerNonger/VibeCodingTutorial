import { NextResponse } from 'next/server';
import { listDecks } from '@/lib/store';

export async function GET() {
  const decks = listDecks();
  return NextResponse.json(decks);
}
