import { ShapeItemData, ShapeRoundData, ShapeType } from './shapeTypes';

export const TOTAL_SHAPE_ROUNDS = 3;

export const SHAPE_CONFIG: Record<
  ShapeType,
  { namePt: string; defaultColorHex: string; gradientFrom: string; gradientTo: string }
> = {
  circle: {
    namePt: 'Círculo',
    defaultColorHex: '#EF4444',
    gradientFrom: '#F87171',
    gradientTo: '#DC2626',
  },
  square: {
    namePt: 'Quadrado',
    defaultColorHex: '#3B82F6',
    gradientFrom: '#60A5FA',
    gradientTo: '#2563EB',
  },
  triangle: {
    namePt: 'Triângulo',
    defaultColorHex: '#F59E0B',
    gradientFrom: '#FBBF24',
    gradientTo: '#D97706',
  },
  star: {
    namePt: 'Estrela',
    defaultColorHex: '#EAB308',
    gradientFrom: '#FDE047',
    gradientTo: '#CA8A04',
  },
};

export const generateShapeRounds = (): ShapeRoundData[] => {
  return [
    // Round 1: 3 basic shapes (Circle, Square, Triangle)
    {
      roundIndex: 0,
      cavities: [
        { id: 'cavity-circle-r0', shape: 'circle' },
        { id: 'cavity-square-r0', shape: 'square' },
        { id: 'cavity-triangle-r0', shape: 'triangle' },
      ],
      pieces: [
        {
          id: 'piece-triangle-r0',
          shape: 'triangle',
          colorName: 'amarelo',
          colorHex: '#F59E0B',
          gradientFrom: '#FBBF24',
          gradientTo: '#D97706',
          borderColor: '#FCD34D',
          shadowColor: '#78350F',
        },
        {
          id: 'piece-circle-r0',
          shape: 'circle',
          colorName: 'vermelho',
          colorHex: '#EF4444',
          gradientFrom: '#F87171',
          gradientTo: '#DC2626',
          borderColor: '#FCA5A5',
          shadowColor: '#7F1D1D',
        },
        {
          id: 'piece-square-r0',
          shape: 'square',
          colorName: 'azul',
          colorHex: '#3B82F6',
          gradientFrom: '#60A5FA',
          gradientTo: '#2563EB',
          borderColor: '#93C5FD',
          shadowColor: '#1E3A8A',
        },
      ],
    },

    // Round 2: 3 basic shapes in new positions and new colors (Reinforcing SHAPE, not color!)
    {
      roundIndex: 1,
      cavities: [
        { id: 'cavity-triangle-r1', shape: 'triangle' },
        { id: 'cavity-circle-r1', shape: 'circle' },
        { id: 'cavity-square-r1', shape: 'square' },
      ],
      pieces: [
        {
          id: 'piece-square-r1',
          shape: 'square',
          colorName: 'laranja',
          colorHex: '#F97316',
          gradientFrom: '#FB923C',
          gradientTo: '#EA580C',
          borderColor: '#FDBA74',
          shadowColor: '#7C2D12',
        },
        {
          id: 'piece-triangle-r1',
          shape: 'triangle',
          colorName: 'verde',
          colorHex: '#10B981',
          gradientFrom: '#34D399',
          gradientTo: '#059669',
          borderColor: '#6EE7B7',
          shadowColor: '#064E3B',
        },
        {
          id: 'piece-circle-r1',
          shape: 'circle',
          colorName: 'roxo',
          colorHex: '#8B5CF6',
          gradientFrom: '#A78BFA',
          gradientTo: '#7C3AED',
          borderColor: '#C4B5FD',
          shadowColor: '#4C1D95',
        },
      ],
    },

    // Round 3: 4 shapes including the cheerful Star (Circle, Square, Triangle, Star)
    {
      roundIndex: 2,
      cavities: [
        { id: 'cavity-circle-r2', shape: 'circle' },
        { id: 'cavity-square-r2', shape: 'square' },
        { id: 'cavity-triangle-r2', shape: 'triangle' },
        { id: 'cavity-star-r2', shape: 'star' },
      ],
      pieces: [
        {
          id: 'piece-star-r2',
          shape: 'star',
          colorName: 'dourado',
          colorHex: '#EAB308',
          gradientFrom: '#FDE047',
          gradientTo: '#CA8A04',
          borderColor: '#FEF08A',
          shadowColor: '#713F12',
        },
        {
          id: 'piece-circle-r2',
          shape: 'circle',
          colorName: 'azul-celeste',
          colorHex: '#0EA5E9',
          gradientFrom: '#38BDF8',
          gradientTo: '#0284C7',
          borderColor: '#7DD3FC',
          shadowColor: '#0C4A6E',
        },
        {
          id: 'piece-square-r2',
          shape: 'square',
          colorName: 'esmeralda',
          colorHex: '#10B981',
          gradientFrom: '#34D399',
          gradientTo: '#059669',
          borderColor: '#6EE7B7',
          shadowColor: '#064E3B',
        },
        {
          id: 'piece-triangle-r2',
          shape: 'triangle',
          colorName: 'coral',
          colorHex: '#EF4444',
          gradientFrom: '#F87171',
          gradientTo: '#DC2626',
          borderColor: '#FCA5A5',
          shadowColor: '#7F1D1D',
        },
      ],
    },
  ];
};
