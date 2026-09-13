export interface SizeItem {
  id: string;
  sizeKey: 'small' | 'medium' | 'large';
  scale: number; // visual scale factor
  fontSizeClass: string;
}

export interface SizeRound {
  id: string;
  emoji: string;
  name: string;
  themeColor: string;
  items: SizeItem[];
}

export const SIZE_ROUNDS: SizeRound[] = [
  {
    id: 'apples',
    emoji: '🍎',
    name: 'Maçãs',
    themeColor: '#EF4444',
    items: [
      { id: 'apple-small', sizeKey: 'small', scale: 0.7, fontSizeClass: 'text-3xl sm:text-4xl' },
      { id: 'apple-med', sizeKey: 'medium', scale: 1.0, fontSizeClass: 'text-5xl sm:text-6xl' },
      { id: 'apple-large', sizeKey: 'large', scale: 1.35, fontSizeClass: 'text-7xl sm:text-8xl' },
    ],
  },
  {
    id: 'flowers',
    emoji: '🌻',
    name: 'Girassóis',
    themeColor: '#EAB308',
    items: [
      { id: 'flower-small', sizeKey: 'small', scale: 0.7, fontSizeClass: 'text-3xl sm:text-4xl' },
      { id: 'flower-med', sizeKey: 'medium', scale: 1.0, fontSizeClass: 'text-5xl sm:text-6xl' },
      { id: 'flower-large', sizeKey: 'large', scale: 1.35, fontSizeClass: 'text-7xl sm:text-8xl' },
    ],
  },
  {
    id: 'elephants',
    emoji: '🐘',
    name: 'Elefantes',
    themeColor: '#0EA5E9',
    items: [
      { id: 'elephant-small', sizeKey: 'small', scale: 0.7, fontSizeClass: 'text-3xl sm:text-4xl' },
      { id: 'elephant-med', sizeKey: 'medium', scale: 1.0, fontSizeClass: 'text-5xl sm:text-6xl' },
      { id: 'elephant-large', sizeKey: 'large', scale: 1.35, fontSizeClass: 'text-7xl sm:text-8xl' },
    ],
  },
];
