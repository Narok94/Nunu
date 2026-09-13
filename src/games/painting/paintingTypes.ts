export interface ColorPaletteItem {
  id: string;
  color: string;
  label: string;
}

export const PALETTE_COLORS: ColorPaletteItem[] = [
  { id: 'red', color: '#EF4444', label: 'Vermelho' },
  { id: 'yellow', color: '#FACC15', label: 'Amarelo' },
  { id: 'blue', color: '#3B82F6', label: 'Azul' },
  { id: 'green', color: '#10B981', label: 'Verde' },
  { id: 'pink', color: '#EC4899', label: 'Rosa' },
  { id: 'purple', color: '#8B5CF6', label: 'Roxo' },
  { id: 'orange', color: '#F97316', label: 'Laranja' },
];

export interface DrawingTemplate {
  id: string;
  name: string;
  defaultFills: Record<string, string>;
  totalSections: number;
}
