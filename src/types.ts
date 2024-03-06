export type Patient = {
  id: number;
  x: number;
  y: number;
  infected: boolean;
};

export type SimulationParameters = {
  distanceThreshold: number;
  movement: number;
  infectionChance: number;
};

export const defaultSimulationParameters: SimulationParameters = {
  distanceThreshold: 5,
  movement: 5,
  infectionChance: 5,
};