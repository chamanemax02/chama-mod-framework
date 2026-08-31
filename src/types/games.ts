import type { NativeFlowButtonDef } from './interactive.js';

export type GameStatus = 'waiting' | 'active' | 'completed' | 'timeout' | 'aborted';

export interface GamePlayer {
  jid: string;
  name: string;
  score: number;
}

export interface GameState<TData = any> {
  id: string;
  gameType: string;
  chatJid: string;
  players: GamePlayer[];
  currentTurn?: string; // Player JID
  status: GameStatus;
  data: TData;
  createdAt: number;
  updatedAt: number;
}

export interface GameRenderResult {
  title: string;
  displayBoard: string;
  footer?: string;
  buttons?: NativeFlowButtonDef[];
  media?: Buffer | Uint8Array;
  mediaType?: 'image';
}

export interface GameLaunchCardOptions {
  title: string;
  gameName: string;
  description: string;
  coverImage?: Buffer | Uint8Array | { url: string };
  playUrl?: string;
  highScore?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
  category?: string;
  playButtonText?: string;
  howToPlayButtonText?: string;
  howToPlayUrl?: string;
}

export interface HighwayRushState {
  score: number;
  playerLane: number; // 0, 1, 2
  distance: number;
  obstacles: Array<{ lane: number; y: number }>;
  gameOver: boolean;
  lives: number;
  speed: number;
}

export interface TicTacToeState {
  board: ('X' | 'O' | ' ')[];
  playerX: string;
  playerO: string;
  winner: string | null; // JID or 'tie'
  turn: 'X' | 'O';
}
