import type { WASocket, WAMessage } from '../../index.js';
import type { GameState, GameLaunchCardOptions } from '../types/games.js';
export declare class GameEngine {
    private readonly sock;
    private readonly sessions;
    constructor(sock: WASocket);
    /**
     * Send a rich Game Launch Card (OpenGraph / Native Flow game launch)
     */
    sendGameLaunchCard(jid: string, options: GameLaunchCardOptions): Promise<WAMessage | undefined>;
    /**
     * Send a Rich HTML Styled Information Card
     */
    sendRichHTMLCard(jid: string, title: string, bodyText: string, linkUrl?: string, footer?: string): Promise<WAMessage | undefined>;
    /**
     * Start a new Highway Rush interactive game session
     */
    startHighwayRush(chatJid: string, playerJid: string, playerName?: string): Promise<WAMessage | undefined>;
    /**
     * Handle Highway Rush move
     */
    handleHighwayRushMove(chatJid: string, action: 'left' | 'right' | 'straight' | 'boost'): Promise<WAMessage | undefined>;
    /**
     * Start a new Tic-Tac-Toe interactive game session
     */
    startTicTacToe(chatJid: string, playerX: string, playerO?: string): Promise<WAMessage | undefined>;
    /**
     * Handle Tic-Tac-Toe move
     */
    handleTicTacToeMove(chatJid: string, playerJid: string, cellIndex: number): Promise<WAMessage | undefined>;
    /**
     * Render and relay game output to WhatsApp chat
     */
    private sendGameRender;
    getSession(chatJid: string, gameType: string): GameState | undefined;
    clearSession(chatJid: string, gameType: string): void;
}
//# sourceMappingURL=GameEngine.d.ts.map