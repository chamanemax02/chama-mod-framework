import type { WASocket, WAMessage, ConnectionState, GroupParticipant, ParticipantAction, WACallEvent, proto, WAMessageKey } from '@whiskeysockets/baileys';
export interface MessageContext {
    message: WAMessage;
    key: WAMessageKey;
    chatId: string;
    fromMe: boolean;
    senderJid: string;
    text?: string;
    isGroup: boolean;
    reply: (text: string) => Promise<WAMessage | undefined>;
    react: (emoji: string) => Promise<WAMessage | undefined>;
}
export declare class EventDispatcher {
    private readonly sock;
    constructor(sock: WASocket);
    /**
     * Listen to incoming messages with a helpful parsed context
     */
    onMessage(handler: (ctx: MessageContext) => void | Promise<void>): () => void;
    /**
     * Listen to connection updates
     */
    onConnectionUpdate(handler: (state: Partial<ConnectionState>) => void | Promise<void>): () => void;
    /**
     * Listen to incoming and updated calls
     */
    onCall(handler: (calls: WACallEvent[]) => void | Promise<void>): () => void;
    /**
     * Listen to group participant updates (join, leave, promote, demote)
     */
    onGroupParticipantsUpdate(handler: (update: {
        id: string;
        author: string;
        participants: GroupParticipant[];
        action: ParticipantAction;
    }) => void | Promise<void>): () => void;
    /**
     * Listen to message reactions
     */
    onReaction(handler: (reactions: {
        key: WAMessageKey;
        reaction: proto.IReaction;
    }[]) => void | Promise<void>): () => void;
}
//# sourceMappingURL=EventDispatcher.d.ts.map