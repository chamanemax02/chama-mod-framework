export class EventDispatcher {
    sock;
    constructor(sock) {
        this.sock = sock;
    }
    /**
     * Listen to incoming messages with a helpful parsed context
     */
    onMessage(handler) {
        const listener = async ({ messages, type }) => {
            if (type !== 'notify')
                return;
            for (const msg of messages) {
                if (!msg.message)
                    continue;
                const chatId = msg.key.remoteJid || '';
                const fromMe = !!msg.key.fromMe;
                const senderJid = msg.key.participant || chatId;
                const isGroup = chatId.endsWith('@g.us');
                // Extract text from regular conversation, extended text, or interactive response
                const text = msg.message.conversation ||
                    msg.message.extendedTextMessage?.text ||
                    msg.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
                    msg.message.buttonsResponseMessage?.selectedButtonId ||
                    msg.message.templateButtonReplyMessage?.selectedId ||
                    msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
                    '';
                const ctx = {
                    message: msg,
                    key: msg.key,
                    chatId,
                    fromMe,
                    senderJid,
                    text,
                    isGroup,
                    reply: async (replyText) => {
                        return await this.sock.sendMessage(chatId, { text: replyText }, { quoted: msg });
                    },
                    react: async (emoji) => {
                        return await this.sock.sendMessage(chatId, {
                            react: { text: emoji, key: msg.key }
                        });
                    }
                };
                try {
                    await handler(ctx);
                }
                catch (err) {
                    console.error('[CHAMA-MOD] Error in message handler:', err);
                }
            }
        };
        this.sock.ev.on('messages.upsert', listener);
        return () => {
            this.sock.ev.off('messages.upsert', listener);
        };
    }
    /**
     * Listen to connection updates
     */
    onConnectionUpdate(handler) {
        this.sock.ev.on('connection.update', handler);
        return () => {
            this.sock.ev.off('connection.update', handler);
        };
    }
    /**
     * Listen to incoming and updated calls
     */
    onCall(handler) {
        this.sock.ev.on('call', handler);
        return () => {
            this.sock.ev.off('call', handler);
        };
    }
    /**
     * Listen to group participant updates (join, leave, promote, demote)
     */
    onGroupParticipantsUpdate(handler) {
        this.sock.ev.on('group-participants.update', handler);
        return () => {
            this.sock.ev.off('group-participants.update', handler);
        };
    }
    /**
     * Listen to message reactions
     */
    onReaction(handler) {
        this.sock.ev.on('messages.reaction', handler);
        return () => {
            this.sock.ev.off('messages.reaction', handler);
        };
    }
}
//# sourceMappingURL=EventDispatcher.js.map