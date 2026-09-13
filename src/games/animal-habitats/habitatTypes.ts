export interface AnimalHabitItem {
  id: string;
  animalEmoji: string;
  animalName: string;
  habitatEmoji: string;
  habitatName: string;
  habitatBg: string;
  borderColor: string;
}

export interface HabitatRound {
  items: AnimalHabitItem[];
}

export const HABITAT_ROUNDS: HabitatRound[] = [
  {
    items: [
      {
        id: 'fish',
        animalEmoji: '🐟',
        animalName: 'Peixinho',
        habitatEmoji: '🌊',
        habitatName: 'Água',
        habitatBg: 'bg-sky-100',
        borderColor: 'border-sky-300',
      },
      {
        id: 'bird',
        animalEmoji: '🐦',
        animalName: 'Passarinho',
        habitatEmoji: '🌳',
        habitatName: 'Árvore',
        habitatBg: 'bg-emerald-100',
        borderColor: 'border-emerald-300',
      },
      {
        id: 'bunny',
        animalEmoji: '🐰',
        animalName: 'Coelhinho',
        habitatEmoji: '🥕',
        habitatName: 'Toca',
        habitatBg: 'bg-amber-100',
        borderColor: 'border-amber-300',
      },
    ],
  },
  {
    items: [
      {
        id: 'frog',
        animalEmoji: '🐸',
        animalName: 'Sapinho',
        habitatEmoji: '🪷',
        habitatName: 'Lagoa',
        habitatBg: 'bg-teal-100',
        borderColor: 'border-teal-300',
      },
      {
        id: 'bee',
        animalEmoji: '🐝',
        animalName: 'Abelhinha',
        habitatEmoji: '🍯',
        habitatName: 'Colmeia',
        habitatBg: 'bg-yellow-100',
        borderColor: 'border-yellow-300',
      },
      {
        id: 'owl',
        animalEmoji: '🦉',
        animalName: 'Corujinha',
        habitatEmoji: '🌲',
        habitatName: 'Floresta',
        habitatBg: 'bg-green-100',
        borderColor: 'border-green-300',
      },
    ],
  },
  {
    items: [
      {
        id: 'duck',
        animalEmoji: '🦆',
        animalName: 'Patinho',
        habitatEmoji: '🏞️',
        habitatName: 'Riacho',
        habitatBg: 'bg-blue-100',
        borderColor: 'border-blue-300',
      },
      {
        id: 'monkey',
        animalEmoji: '🐒',
        animalName: 'Macaquinho',
        habitatEmoji: '🌴',
        habitatName: 'Palmeira',
        habitatBg: 'bg-lime-100',
        borderColor: 'border-lime-300',
      },
      {
        id: 'bear',
        animalEmoji: '🐻',
        animalName: 'Ursinho',
        habitatEmoji: '🪵',
        habitatName: 'Caverna',
        habitatBg: 'bg-amber-100',
        borderColor: 'border-amber-300',
      },
    ],
  },
];
