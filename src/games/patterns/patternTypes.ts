export interface PatternRound {
  id: string;
  sequence: string[];
  missingIndex: number;
  correctAnswer: string;
  options: string[];
}

export const PATTERN_ROUNDS: PatternRound[] = [
  {
    id: 'fruits',
    sequence: ['🍎', '🍌', '🍎', '🍌'],
    missingIndex: 4,
    correctAnswer: '🍎',
    options: ['🍎', '🍌'],
  },
  {
    id: 'colors',
    sequence: ['🔴', '🔵', '🔴', '🔵'],
    missingIndex: 4,
    correctAnswer: '🔴',
    options: ['🔴', '🔵', '🟢'],
  },
  {
    id: 'pets',
    sequence: ['🐶', '🐱', '🐶', '🐱'],
    missingIndex: 4,
    correctAnswer: '🐶',
    options: ['🐶', '🐱', '🐸'],
  },
];
