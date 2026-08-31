import type {
  WASocket,
  WAMessage,
  ConnectionState,
  GroupMetadata,
  GroupParticipant,
  ParticipantAction,
  WACallEvent,
  proto,
  WAMessageKey
} from '@whiskeysockets/baileys';

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

export class EventDispatcher {
  constructor(private readonly sock: WASocket) {}

  /**
   * Listen to incoming messages with a helpful parsed context
   */
  public onMessage(handler: (ctx: MessageContext) => void | Promise<void>): () => void {
    const listener = async ({ messages, type }: { messages: WAMessage[]; type: string }) => {
      if (type !== 'notify') return;

      for (const msg of messages) {
        if (!msg.message) continue;

        const chatId = msg.key.remoteJid || '';
        const fromMe = !!msg.key.fromMe;
        const senderJid = msg.key.participant || chatId;
        const isGroup = chatId.endsWith('@g.us');

        // Extract text from regular conversation, extended text, or interactive response
        const text =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          msg.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
          msg.message.buttonsResponseMessage?.selectedButtonId ||
          msg.message.templateButtonReplyMessage?.selectedId ||
          msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
          '';

        const ctx: MessageContext = {
          message: msg,
          key: msg.key,
          chatId,
          fromMe,
          senderJid,
          text,
          isGroup,
          reply: async (replyText: string) => {
            return await this.sock.sendMessage(
              chatId,
              { text: replyText },
              { quoted: msg }
            );
          },
          react: async (emoji: string) => {
            return await this.sock.sendMessage(chatId, {
              react: { text: emoji, key: msg.key }
            });
          }
        };

        try {
          await handler(ctx);
        } catch (err) {
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
  public onConnectionUpdate(handler: (state: Partial<ConnectionState>) => void | Promise<void>): () => void {
    this.sock.ev.on('connection.update', handler);
    return () => {
      this.sock.ev.off('connection.update', handler);
    };
  }

  /**
   * Listen to incoming and updated calls
   */
  public onCall(handler: (calls: WACallEvent[]) => void | Promise<void>): () => void {
    this.sock.ev.on('call', handler);
    return () => {
      this.sock.ev.off('call', handler);
    };
  }

  /**
   * Listen to group participant updates (join, leave, promote, demote)
   */
  public onGroupParticipantsUpdate(
    handler: (update: {
      id: string;
      author: string;
      participants: GroupParticipant[];
      action: ParticipantAction;
    }) => void | Promise<void>
  ): () => void {
    this.sock.ev.on('group-participants.update', handler);
    return () => {
      this.sock.ev.off('group-participants.update', handler);
    };
  }

  /**
   * Listen to message reactions
   */
  public onReaction(
    handler: (reactions: { key: WAMessageKey; reaction: proto.IReaction }[]) => void | Promise<void>
  ): () => void {
    this.sock.ev.on('messages.reaction', handler);
    return () => {
      this.sock.ev.off('messages.reaction', handler);
    };
  }
}
