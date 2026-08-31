import { proto, type WASocket, type WAMessageKey, type WAMessage } from '@whiskeysockets/baileys';
import type { PinMessageOptions } from '../types/messages.js';

export class EditDeletePinManager {
  constructor(private readonly sock: WASocket) {}

  /**
   * Edit an existing message sent by the bot/user
   */
  public async editMessage(jid: string, targetKey: WAMessageKey, newText: string): Promise<WAMessage | undefined> {
    return await this.sock.sendMessage(jid, {
      text: newText,
      edit: targetKey
    });
  }

  /**
   * Delete / revoke a message for everyone
   */
  public async deleteMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined> {
    return await this.sock.sendMessage(jid, {
      delete: targetKey
    });
  }

  /**
   * Pin a message in chat
   */
  public async pinMessage(
    jid: string,
    targetKey: WAMessageKey,
    options?: PinMessageOptions
  ): Promise<WAMessage | undefined> {
    const duration = options?.durationSeconds || 86400 * 30; // 30 days default
    const pinType = proto.Message.PinInChatMessage.Type.PIN_FOR_ALL;
    return await this.sock.sendMessage(jid, {
      pin: targetKey,
      type: pinType,
      time: duration
    } as any);
  }

  /**
   * Unpin a pinned message in chat
   */
  public async unpinMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined> {
    const unpinType = proto.Message.PinInChatMessage.Type.UNPIN_FOR_ALL;
    return await this.sock.sendMessage(jid, {
      pin: targetKey,
      type: unpinType
    } as any);
  }

  /**
   * React to a message with an emoji
   */
  public async sendReaction(jid: string, emoji: string, targetKey: WAMessageKey): Promise<WAMessage | undefined> {
    return await this.sock.sendMessage(jid, {
      react: {
        text: emoji,
        key: targetKey
      }
    });
  }
}
