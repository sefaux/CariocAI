export interface Player {
  id: number;
  name: string;
  scores: (number | null)[];
}

export interface Card {
  rank: string;
  suit: string;
}

export interface GameSettings {
  cardScores: Record<string, number>;
  enabledRounds: string[];
}

export enum GamePhase {
  Setup,
  WinnerSelection,
  ScoreInput,
  Standings,
  Finished,
  Scanning,
  ScanConfirmation,
}