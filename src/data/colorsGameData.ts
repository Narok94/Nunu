import { ColorData, FoodItemData } from '../types';

export const COLORS_CONFIG: Record<string, ColorData> = {
  red: {
    id: 'red',
    namePt: 'Vermelho',
    hex: '#EF4444',
    bodyColor: 'bg-red-500',
    darkColor: 'border-red-600',
    lightColor: 'bg-red-100',
    textColor: 'text-red-600',
    creatureName: 'Bichinho Vermelho',
    cheerPhrase: 'Vermelho! Que delícia!',
  },
  yellow: {
    id: 'yellow',
    namePt: 'Amarelo',
    hex: '#FACC15',
    bodyColor: 'bg-amber-400',
    darkColor: 'border-amber-500',
    lightColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    creatureName: 'Bichinho Amarelo',
    cheerPhrase: 'Amarelo! Muito bem!',
  },
  green: {
    id: 'green',
    namePt: 'Verde',
    hex: '#22C55E',
    bodyColor: 'bg-emerald-500',
    darkColor: 'border-emerald-600',
    lightColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    creatureName: 'Bichinho Verde',
    cheerPhrase: 'Verde! Que gostoso!',
  },
  blue: {
    id: 'blue',
    namePt: 'Azul',
    hex: '#3B82F6',
    bodyColor: 'bg-blue-500',
    darkColor: 'border-blue-600',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    creatureName: 'Bichinho Azul',
    cheerPhrase: 'Azul! Você conseguiu!',
  },
  purple: {
    id: 'purple',
    namePt: 'Roxo',
    hex: '#A855F7',
    bodyColor: 'bg-purple-500',
    darkColor: 'border-purple-600',
    lightColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    creatureName: 'Bichinho Roxo',
    cheerPhrase: 'Roxo! Parabéns!',
  },
};

export const ALL_FOODS: FoodItemData[] = [
  // Vermelho (100% vermelho vivo e imediatamente reconhecível por crianças)
  { id: 'strawberry', namePt: 'Morango', colorId: 'red', emoji: '🍓', badgeBg: 'bg-red-100' },
  { id: 'apple', namePt: 'Maçã', colorId: 'red', emoji: '🍎', badgeBg: 'bg-red-100' },
  { id: 'watermelon', namePt: 'Melancia', colorId: 'red', emoji: '🍉', badgeBg: 'bg-red-100' },
  { id: 'cherry', namePt: 'Cereja', colorId: 'red', emoji: '🍒', badgeBg: 'bg-red-100' },
  { id: 'tomato', namePt: 'Tomate', colorId: 'red', emoji: '🍅', badgeBg: 'bg-red-100' },

  // Amarelo (100% amarelo puro - removido abacaxi que é marrom/verde)
  { id: 'banana', namePt: 'Banana', colorId: 'yellow', emoji: '🍌', badgeBg: 'bg-amber-100' },
  { id: 'cheese', namePt: 'Queijo', colorId: 'yellow', emoji: '🧀', badgeBg: 'bg-amber-100' },
  { id: 'corn', namePt: 'Milho', colorId: 'yellow', emoji: '🌽', badgeBg: 'bg-amber-100' },
  { id: 'lemon', namePt: 'Limãozinho', colorId: 'yellow', emoji: '🍋', badgeBg: 'bg-amber-100' },
  { id: 'butter', namePt: 'Manteiguinha', colorId: 'yellow', emoji: '🧈', badgeBg: 'bg-amber-100' },

  // Verde (100% verde brilhante e natural)
  { id: 'broccoli', namePt: 'Brócolis', colorId: 'green', emoji: '🥦', badgeBg: 'bg-emerald-100' },
  { id: 'greenapple', namePt: 'Maçã Verde', colorId: 'green', emoji: '🍏', badgeBg: 'bg-emerald-100' },
  { id: 'pear', namePt: 'Pera', colorId: 'green', emoji: '🍐', badgeBg: 'bg-emerald-100' },
  { id: 'cucumber', namePt: 'Pepino', colorId: 'green', emoji: '🥒', badgeBg: 'bg-emerald-100' },
  { id: 'peapod', namePt: 'Ervilha', colorId: 'green', emoji: '🫛', badgeBg: 'bg-emerald-100' },
  { id: 'avocado', namePt: 'Abacate', colorId: 'green', emoji: '🥑', badgeBg: 'bg-emerald-100' },

  // Azul (100% azul profundo e puro - removidos itens brancos, cinzas e uva roxa)
  { id: 'blueberry', namePt: 'Mirtilo', colorId: 'blue', emoji: '🫐', badgeBg: 'bg-blue-100' },

  // Roxo (100% roxo autêntico - uva realocada corretamente)
  { id: 'grapes', namePt: 'Uva', colorId: 'purple', emoji: '🍇', badgeBg: 'bg-purple-100' },
  { id: 'eggplant', namePt: 'Berinjela', colorId: 'purple', emoji: '🍆', badgeBg: 'bg-purple-100' },
];

export const ENCOURAGING_PHRASES = [
  'Muito bem!',
  'Você conseguiu!',
  'Que delícia!',
  'Parabéns!',
  'Que espertinho!',
];

export const TRY_AGAIN_PHRASES = [
  'Vamos tentar outra vez!',
  'Quase lá, tente de novo!',
  'Vamos achar a cor certa!',
];
