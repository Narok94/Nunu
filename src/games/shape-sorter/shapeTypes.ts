export type ShapeType = 'circle' | 'square' | 'triangle' | 'star';

export interface ShapeItemData {
  id: string; // unique instance ID e.g. "circle-r0"
  shape: ShapeType;
  colorName: string; // for aria-label, e.g. "vermelho"
  colorHex: string; // main fill color
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  shadowColor: string;
}

export interface ShapeCavitySlot {
  id: string; // unique slot id e.g. "cavity-circle-r0"
  shape: ShapeType;
}

export interface ShapeRoundData {
  roundIndex: number;
  cavities: ShapeCavitySlot[];
  pieces: ShapeItemData[];
}
