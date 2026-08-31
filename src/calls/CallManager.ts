import type { WASocket, WACallEvent } from '@whiskeysockets/baileys';
import type {
  CallEventListener,
  CallHandlerContext,
  CallLinkOptions,
  CallLinkResult,
  OutgoingCallOfferOptions,
  VideoStreamOptions,
  VideoStreamSession
} from '../types/calls.js';
import { CallLinksManager } from './CallLinks.js';
import { CallSignalingManager } from './CallSignaling.js';
import { VoIPMediaStreamer } from './VoIPMediaStreamer.js';

export class CallManager {
  private readonly callLinks: CallLinksManager;
  private readonly signaling: CallSignalingManager;
  private readonly streamer: VoIPMediaStreamer;
  private readonly callListeners: Set<CallEventListener> = new Set();
  private autoRejectEnabled = false;
  private autoRejectReason = 'Calls are not accepted on this automated WhatsApp number.';

  constructor(private readonly sock: WASocket) {
    this.callLinks = new CallLinksManager(sock);
    this.signaling = new CallSignalingManager(sock);
    this.streamer = new VoIPMediaStreamer(sock);
    this.setupCallEventListener();
  }

  private setupCallEventListener(): void {
    this.sock.ev.on('call', async (calls: WACallEvent[]) => {
      for (const call of calls) {
        const isIncoming = call.status === 'offer';
        const ctx: CallHandlerContext = {
          call,
          isIncoming,
          isOffer: isIncoming,
          isVideo: !!call.isVideo,
          isGroup: !!call.isGroup,
          callerJid: call.from || call.chatId,
          callerPn: call.callerPn,
          callId: call.id,
          status: call.status,
          date: call.date,
          reject: async () => {
            await this.signaling.rejectCall(call.id, call.from || call.chatId);
          }
        };

        // Auto-reject if enabled
        if (this.autoRejectEnabled && isIncoming) {
          try {
            await ctx.reject();
            if (this.autoRejectReason) {
              await this.sock.sendMessage(ctx.callerJid, {
                text: `📵 ${this.autoRejectReason}`
              });
            }
          } catch (err) {
            console.error('[CHAMA-MOD] Auto-reject failed:', err);
          }
        }

        // Notify custom listeners
        for (const listener of this.callListeners) {
          try {
            await listener(ctx);
          } catch (err) {
            console.error('[CHAMA-MOD] Call listener error:', err);
          }
        }
      }
    });
  }

  /**
   * Listen to incoming and call update events
   */
  public onCall(listener: CallEventListener): () => void {
    this.callListeners.add(listener);
    return () => {
      this.callListeners.delete(listener);
    };
  }

  /**
   * Enable or disable automatic incoming call rejection
   */
  public setAutoReject(enabled: boolean, responseMessage?: string): this {
    this.autoRejectEnabled = enabled;
    if (responseMessage !== undefined) {
      this.autoRejectReason = responseMessage;
    }
    return this;
  }

  /**
   * Reject an incoming call
   */
  public async rejectCall(callId: string, fromJid: string): Promise<void> {
    return await this.signaling.rejectCall(callId, fromJid);
  }

  /**
   * Create a Voice Call Link
   */
  public async createVoiceCallLink(event?: { startTime: number }, timeoutMs?: number): Promise<CallLinkResult> {
    return await this.callLinks.createVoiceCallLink(event, timeoutMs);
  }

  /**
   * Create a Video Call Link
   */
  public async createVideoCallLink(event?: { startTime: number }, timeoutMs?: number): Promise<CallLinkResult> {
    return await this.callLinks.createVideoCallLink(event, timeoutMs);
  }

  /**
   * Create a Call Link (audio or video)
   */
  public async createCallLink(options: CallLinkOptions): Promise<CallLinkResult> {
    return await this.callLinks.createCallLink(options);
  }

  /**
   * Send experimental outgoing call signaling offer
   */
  public async call(toJid: string, options: { type: 'audio' | 'video' }): Promise<{ callId: string; status: string }> {
    return await this.signaling.sendCallOfferSignaling({
      toJid,
      type: options.type
    });
  }

  /**
   * Terminate call signaling
   */
  public async terminateCall(toJid: string, callId: string): Promise<void> {
    return await this.signaling.sendCallTerminateSignaling(toJid, callId);
  }

  /**
   * Start a real-time Video Call Streaming Session playing a video file
   */
  public async streamVideoCall(toJid: string, options: VideoStreamOptions): Promise<VideoStreamSession> {
    return await this.streamer.streamVideoCall(toJid, options);
  }

  /**
   * Stop any active video stream
   */
  public async stopVideoStream(): Promise<void> {
    await this.streamer.stopStream();
  }
}
