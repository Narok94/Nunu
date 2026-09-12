import { WorldTheme, UserAdventureProgress } from '../types';

export const JARDIM_DA_NUNU: WorldTheme = {
  id: 'garden',
  name: 'Jardim da Nunu',
  subtitle: 'Flores, borboletas e frutas deliciosas',
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
      isPlayable: false,
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
      isPlayable: false,
    },
    {
      id: 'colors',
      order: 3,
      title: 'Escolha a Cor',
      subtitle: 'Arco-íris Mágico',
      emoji: '🎨',
      themeColor: '#F59E0B',
      accentBg: '#FEF3C7',
      borderColor: '#FCD34D',
      isPlayable: false,
    },
    {
      id: 'drawing',
      order: 4,
      title: 'Vamos Pintar',
      subtitle: 'Desenho e Criatividade',
      emoji: '🖍️',
      themeColor: '#EC4899',
      accentBg: '#FCE7F3',
      borderColor: '#F9A8D4',
      isPlayable: false,
    },
    {
      id: 'matching',
      order: 5,
      title: 'Combine os Iguais',
      subtitle: 'Pares e Memória',
      emoji: '🧩',
      themeColor: '#8B5CF6',
      accentBg: '#EDE9FE',
      borderColor: '#C4B5FD',
      isPlayable: false,
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
