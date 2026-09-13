export interface MemoryCard {
  id: string;
  pairKey: string;
  emoji: string;
  label: string;
}

export interface MemoryRound {
  pairs: { pairKey: string; emoji: string; label: string }[];
}

export const MEMORY_ROUNDS: MemoryRound[] = [
  {
    // Round 1: 2 pairs = 4 cards
    pairs: [
      { pairKey: 'dog', emoji: '🐶', label: 'Cachorrinho' },
      { pairKey: 'cat', emoji: '🐱', label: 'Gatinho' },
    ],
  },
  {
    // Round 2: 3 pairs = 6 cards
    pairs: [
      { pairKey: 'lion', emoji: '🦁', label: 'Leãozinho' },
      { pairKey: 'panda', emoji: '🐼', label: 'Urso Panda' },
      { pairKey: 'koala', emoji: '🐨', label: 'Coala' },
    ],
  },
  {
    // Round 3: 3 pairs = 6 cards
    pairs: [
      { pairKey: 'apple', emoji: '🍎', label: 'Maçã' },
      { pairKey: 'grape', emoji: '🍇', label: 'Uva' },
      { pairKey: 'strawberry', emoji: '🍓', label: 'Morango' },
    ],
  },
];
