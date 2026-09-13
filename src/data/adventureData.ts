import { WorldTheme, UserAdventureProgress } from '../types';

export const JARDIM_DA_NUNU: WorldTheme = {
  id: 'garden',
  name: 'Jardim da Nunu',
  subtitle: 'Flores, borboletas e muitas brincadeiras',
  emoji: '🌸',
  isUnlocked: true,
  nodes: [
    {
      id: 'feed-the-pet',
      order: 0,
      title: 'Alimente o Bichinho',
      subtitle: 'Cores e Frutas',
      emoji: '🍎',
      themeColor: '#EF4444',
      accentBg: '#FEE2E2',
      borderColor: '#FCA5A5',
      minigameId: 'feed-the-pet',
      isPlayable: true,
    },
    {
      id: 'shapes',
      order: 1,
      title: 'Encaixe as Formas',
      subtitle: 'Formas e Figuras',
      emoji: '🔺',
      themeColor: '#3B82F6',
      accentBg: '#DBEAFE',
      borderColor: '#93C5FD',
      minigameId: 'shapes',
      isPlayable: true,
    },
    {
      id: 'counting',
      order: 2,
      title: 'Conte os Bichinhos',
      subtitle: 'Números e Amigos',
      emoji: '🐞',
      themeColor: '#10B981',
      accentBg: '#D1FAE5',
      borderColor: '#6EE7B7',
      minigameId: 'counting',
      isPlayable: true,
    },
    {
      id: 'matching',
      order: 3,
      title: 'Combine os Iguais',
      subtitle: 'Pares e Amigos',
      emoji: '🧩',
      themeColor: '#8B5CF6',
      accentBg: '#EDE9FE',
      borderColor: '#C4B5FD',
      minigameId: 'matching',
      isPlayable: true,
    },
    {
      id: 'memory',
      order: 4,
      title: 'Jogo da Memória',
      subtitle: 'Cartas e Pares',
      emoji: '🃏',
      themeColor: '#F59E0B',
      accentBg: '#FEF3C7',
      borderColor: '#FCD34D',
      minigameId: 'memory',
      isPlayable: true,
    },
    {
      id: 'painting',
      order: 5,
      title: 'Vamos Pintar',
      subtitle: 'Cores e Desenho',
      emoji: '🎨',
      themeColor: '#EC4899',
      accentBg: '#FCE7F3',
      borderColor: '#F9A8D4',
      minigameId: 'painting',
      isPlayable: true,
    },
    {
      id: 'animal-habitats',
      order: 6,
      title: 'Animais e Lugares',
      subtitle: 'Bichinhos e Casinhas',
      emoji: '🐾',
      themeColor: '#0EA5E9',
      accentBg: '#E0F2FE',
      borderColor: '#7DD3FC',
      minigameId: 'animal-habitats',
      isPlayable: true,
    },
    {
      id: 'patterns',
      order: 7,
      title: 'Complete o Padrão',
      subtitle: 'Sequências Divertidas',
      emoji: '🔁',
      themeColor: '#F97316',
      accentBg: '#FFEDD5',
      borderColor: '#FDBA74',
      minigameId: 'patterns',
      isPlayable: true,
    },
    {
      id: 'size-ordering',
      order: 8,
      title: 'Organize por Tamanho',
      subtitle: 'Pequeno, Médio e Grande',
      emoji: '📏',
      themeColor: '#14B8A6',
      accentBg: '#CCFBF1',
      borderColor: '#5EEAD4',
      minigameId: 'size-ordering',
      isPlayable: true,
    },
    {
      id: 'nunu-car',
      order: 9,
      title: 'Carrinho da Nunu',
      subtitle: 'Acelerar e Frear',
      emoji: '🚗',
      themeColor: '#6366F1',
      accentBg: '#E0E7FF',
      borderColor: '#A5B4FC',
      minigameId: 'nunu-car',
      isPlayable: true,
    },
  ],
};

// Architecture preparation for future worlds
export const ALL_WORLDS: WorldTheme[] = [
  JARDIM_DA_NUNU,
  {
    id: 'sea',
    name: 'Fundo do Mar',
    subtitle: 'Peixinhos, conchas e corais',
    emoji: '🌊',
    isUnlocked: false,
    nodes: [],
  },
  {
    id: 'dino',
    name: 'Mundo dos Dinossauros',
    subtitle: 'Passos gigantes e aventuras pré-históricas',
    emoji: '🦕',
    isUnlocked: false,
    nodes: [],
  },
  {
    id: 'space',
    name: 'Espaço Encantado',
    subtitle: 'Estrelas cadentes e planetas fofos',
    emoji: '🚀',
    isUnlocked: false,
    nodes: [],
  },
  {
    id: 'forest',
    name: 'Floresta Encantada',
    subtitle: 'Árvores mágicas e cogumelos luminosos',
    emoji: '🍄',
    isUnlocked: false,
    nodes: [],
  },
];

const PROGRESS_STORAGE_KEY = 'mundo_da_nunu_adventure_progress_v1';

export const loadAdventureProgress = (): UserAdventureProgress => {
  try {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.unlockedNodeIndex === 'number') {
        return parsed;
      }
    }
  } catch {}
  return {
    unlockedNodeIndex: 0,
    currentNodeIndex: 0,
    starsCount: 0,
    completedNodeIds: [],
  };
};

export const saveAdventureProgress = (progress: UserAdventureProgress): void => {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {}
};

export const resetAdventureProgress = (): UserAdventureProgress => {
  const initial: UserAdventureProgress = {
    unlockedNodeIndex: 0,
    currentNodeIndex: 0,
    starsCount: 0,
    completedNodeIds: [],
  };
  saveAdventureProgress(initial);
  return initial;
};
