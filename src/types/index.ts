export type CategoryId = 'colors' | 'numbers' | 'shapes' | 'animals' | 'drawing' | 'matching';

export interface CategoryInfo {
  id: CategoryId;
  title: string;
  subtitle: string;
  emoji: string;
  pastelBg: string;
  borderColor: string;
  iconBg: string;
  accentColor: string;
  isAvailable: boolean;
  minigameId?: string;
}

export type ColorId = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange';

export interface ColorData {
  id: ColorId;
  namePt: string;
  hex: string;
  bodyColor: string;
  darkColor: string;
  lightColor: string;
  textColor: string;
  creatureName: string;
  cheerPhrase: string;
}

export interface FoodItemData {
  id: string;
  namePt: string;
  colorId: ColorId;
  emoji: string;
  badgeBg: string;
}

export interface AudioSettings {
  soundEffects: boolean;
  voiceNarration: boolean;
}

export interface AdventureNode {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  emoji: string;
  themeColor: string;
  accentBg: string;
  borderColor: string;
  minigameId?: string;
  isPlayable: boolean;
}

export interface WorldTheme {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  isUnlocked: boolean;
  nodes: AdventureNode[];
}

export interface UserAdventureProgress {
  unlockedNodeIndex: number;
  currentNodeIndex: number;
  starsCount: number;
  completedNodeIds: string[];
}
