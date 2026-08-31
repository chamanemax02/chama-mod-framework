import { proto } from '@whiskeysockets/baileys';
import type { GameLaunchCardOptions } from '../types/games.js';
export declare class GameCards {
    /**
     * Builds a WhatsApp Native Flow Game Launch Card
     */
    static buildGameLaunchCard(options: GameLaunchCardOptions): proto.IMessage;
    /**
     * Build a rich HTML-styled card preview
     */
    static buildRichHTMLCard(title: string, bodyText: string, linkUrl?: string, footer?: string): proto.IMessage;
}
//# sourceMappingURL=GameCards.d.ts.map