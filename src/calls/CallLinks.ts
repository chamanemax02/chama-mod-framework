import type { WASocket } from '@whiskeysockets/baileys';
import type { CallLinkOptions, CallLinkResult, CallMediaType } from '../types/calls.js';
import { ProtocolError } from '../core/Errors.js';

export class CallLinksManager {
  constructor(private readonly sock: WASocket) {}

  /**
   * Create a native WhatsApp Call Link (Audio or Video)
   */
  public async createCallLink(options: CallLinkOptions): Promise<CallLinkResult> {
    try {
      const token = await this.sock.createCallLink(options.type, options.event, options.timeoutMs);
      if (!token) {
        throw new ProtocolError('WhatsApp server returned an empty call link token');
      }

      const url = `https://call.whatsapp.com/${options.type}/${token}`;
      return {
        token,
        type: options.type,
        url,
        startTime: options.event?.startTime
      };
    } catch (error: any) {
      throw new ProtocolError(`Failed to create ${options.type} call link: ${error.message}`, error);
    }
  }

  /**
   * Create a Voice Call Link
   */
  public async createVoiceCallLink(event?: { startTime: number }, timeoutMs?: number): Promise<CallLinkResult> {
    return await this.createCallLink({ type: 'audio', event, timeoutMs });
  }

  /**
   * Create a Video Call Link
   */
  public async createVideoCallLink(event?: { startTime: number }, timeoutMs?: number): Promise<CallLinkResult> {
    return await this.createCallLink({ type: 'video', event, timeoutMs });
  }
}
