import type { TicTacToeState, GameRenderResult } from '../../types/games.js';
export declare class TicTacToeGame {
    static createInitialState(playerX: string, playerO: string): TicTacToeState;
    static handleMove(state: TicTacToeState, playerJid: string, index: number): TicTacToeState;
    private static checkWinner;
    static render(state: TicTacToeState): GameRenderResult;
}
//# sourceMappingURL=TicTacToe.d.ts.map