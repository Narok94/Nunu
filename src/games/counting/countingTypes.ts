export interface CountingRound {
  targetCount: number;
  creatureEmoji: string;
  creatureName: string;
  themeColor: string;
  bgGradient: string;
  options: number[];
}

export const COUNTING_ROUNDS: CountingRound[] = [
  {
    targetCount: 2,
    creatureEmoji: '🐞',
    creatureName: 'Joaninha',
    themeColor: '#EF4444',
    bgGradient: 'from-rose-50 to-emerald-50',
    options: [1, 2, 3],
  },
  {
    targetCount: 3,
    creatureEmoji: '🐝',
    creatureName: 'Abelha',
    themeColor: '#F59E0B',
    bgGradient: 'from-amber-50 to-emerald-50',
    options: [2, 3, 4],
  },
  {
    targetCount: 4,
    creatureEmoji: '🦋',
    creatureName: 'Borboleta',
    themeColor: '#3B82F6',
    bgGradient: 'from-sky-50 to-emerald-50',
    options: [3, 4, 5],
  },
];
