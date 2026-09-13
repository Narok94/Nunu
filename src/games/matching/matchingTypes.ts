export interface MatchingPair {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export interface MatchingRound {
  pairs: MatchingPair[];
}

export const MATCHING_ROUNDS: MatchingRound[] = [
  {
    pairs: [
      { id: 'apple', emoji: '🍎', label: 'Maçã', color: '#EF4444' },
      { id: 'banana', emoji: '🍌', label: 'Banana', color: '#F59E0B' },
    ],
  },
  {
    pairs: [
      { id: 'fish', emoji: '🐟', label: 'Peixinho', color: '#3B82F6' },
      { id: 'frog', emoji: '🐸', label: 'Sapinho', color: '#10B981' },
      { id: 'duck', emoji: '🦆', label: 'Patinho', color: '#F97316' },
    ],
  },
  {
    pairs: [
      { id: 'flower', emoji: '🌸', label: 'Florzinha', color: '#EC4899' },
      { id: 'sunflower', emoji: '🌻', label: 'Girassol', color: '#EAB308' },
      { id: 'mushroom', emoji: '🍄', label: 'Cogumelo', color: '#8B5CF6' },
    ],
  },
];
