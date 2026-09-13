export interface CarStage {
  id: number;
  title: string;
  targetDistance: number;
  obstacleType?: 'none' | 'ducklings' | 'finish_line';
  obstaclePosition: number;
}

export const CAR_STAGES: CarStage[] = [
  {
    id: 1,
    title: 'Pista Aberta',
    targetDistance: 600,
    obstacleType: 'none',
    obstaclePosition: 0,
  },
  {
    id: 2,
    title: 'Patinhos no Caminho',
    targetDistance: 800,
    obstacleType: 'ducklings',
    obstaclePosition: 400,
  },
  {
    id: 3,
    title: 'Chegada da Festa',
    targetDistance: 900,
    obstacleType: 'finish_line',
    obstaclePosition: 850,
  },
];
