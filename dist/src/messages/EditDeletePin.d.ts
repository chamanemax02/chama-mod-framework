import { type WASocket, type WAMessageKey, type WAMessage } from '@whiskeysockets/baileys';
import type { PinMessageOptions } from '../types/messages.js';
export declare class EditDeletePinManager {
    private readonly sock;
    constructor(sock: WASocket);
    /**
     * Edit an existing message sent by the bot/user
     */
    editMessage(jid: string, targetKey: WAMessageKey, newText: string): Promise<WAMessage | undefined>;
    /**
     * Delete / revoke a message for everyone
     */
    deleteMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined>;
    /**
     * Pin a message in chat
     */
    pinMessage(jid: string, targetKey: WAMessageKey, options?: PinMessageOptions): Promise<WAMessage | undefined>;
    /**
     * Unpin a pinned message in chat
     */
    unpinMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined>;
    /**
     * React to a message with an emoji
     */
    sendReaction(jid: string, emoji: string, targetKey: WAMessageKey): Promise<WAMessage | undefined>;
}
//# sourceMappingURL=EditDeletePin.d.ts.map