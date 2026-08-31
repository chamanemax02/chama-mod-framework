import type { HighwayRushState, GameRenderResult } from '../../types/games.js';
export declare class HighwayRushGame {
    static createInitialState(): HighwayRushState;
    static handleMove(state: HighwayRushState, action: 'left' | 'right' | 'straight' | 'boost'): HighwayRushState;
    static render(state: HighwayRushState): GameRenderResult;
}
//# sourceMappingURL=HighwayRush.d.ts.map