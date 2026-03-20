import { Deck } from './generator';

const decks: Map<string, Deck> = new Map();

export function saveDeck(deck: Deck): void {
  decks.set(deck.id, deck);
}

export function getDeck(id: string): Deck | undefined {
  return decks.get(id);
}

export function listDecks(): Deck[] {
  return Array.from(decks.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
