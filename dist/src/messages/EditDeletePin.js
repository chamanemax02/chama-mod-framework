import { proto } from '@whiskeysockets/baileys';
export class EditDeletePinManager {
    sock;
    constructor(sock) {
        this.sock = sock;
    }
    /**
     * Edit an existing message sent by the bot/user
     */
    async editMessage(jid, targetKey, newText) {
        return await this.sock.sendMessage(jid, {
            text: newText,
            edit: targetKey
        });
    }
    /**
     * Delete / revoke a message for everyone
     */
    async deleteMessage(jid, targetKey) {
        return await this.sock.sendMessage(jid, {
            delete: targetKey
        });
    }
    /**
     * Pin a message in chat
     */
    async pinMessage(jid, targetKey, options) {
        const duration = options?.durationSeconds || 86400 * 30; // 30 days default
        const pinType = proto.Message.PinInChatMessage.Type.PIN_FOR_ALL;
        return await this.sock.sendMessage(jid, {
            pin: targetKey,
            type: pinType,
            time: duration
        });
    }
    /**
     * Unpin a pinned message in chat
     */
    async unpinMessage(jid, targetKey) {
        const unpinType = proto.Message.PinInChatMessage.Type.UNPIN_FOR_ALL;
        return await this.sock.sendMessage(jid, {
            pin: targetKey,
            type: unpinType
        });
    }
    /**
     * React to a message with an emoji
     */
    async sendReaction(jid, emoji, targetKey) {
        return await this.sock.sendMessage(jid, {
            react: {
                text: emoji,
                key: targetKey
            }
        });
    }
}
//# sourceMappingURL=EditDeletePin.js.map