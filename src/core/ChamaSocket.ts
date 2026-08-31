import makeWASocket, {
  type UserFacingSocketConfig,
  type WASocket,
  type WAMessage,
  type WAMessageKey,
  type WAMediaUpload
} from '@whiskeysockets/baileys';
import { MessageManager } from '../messages/MessageManager.js';
import { CallManager } from '../calls/CallManager.js';
import { GroupManager } from '../groups/GroupManager.js';
import { NewsletterManager } from '../newsletters/NewsletterManager.js';
import { GameEngine } from '../games/GameEngine.js';
import { EventDispatcher, type MessageContext } from '../events/EventDispatcher.js';
import { PluginManager } from '../plugins/PluginManager.js';
import type { ChamaPlugin } from '../plugins/types.js';
import { detectCapabilities, type FrameworkCapabilities } from './Capabilities.js';
import type {
  SendTextOptions,
  SendMediaOptions,
  SendAudioOptions,
  SendLocationOptions,
  SendContactItem,
  SendPollOptions,
  SendAlbumOptions,
  SendEventOptions,
  PinMessageOptions
} from '../types/messages.js';
import type {
  InteractiveMessageOptions,
  RichResponseOptions,
  CarouselCardOptions
} from '../types/interactive.js';
import type { GameLaunchCardOptions } from '../types/games.js';
import type {
  CallLinkOptions,
  CallLinkResult,
  VideoStreamOptions,
  VideoStreamSession
} from '../types/calls.js';

export class ChamaSocket {
  public readonly raw: WASocket;
  public readonly messages: MessageManager;
  public readonly calls: CallManager;
  public readonly groups: GroupManager;
  public readonly newsletters: NewsletterManager;
  public readonly games: GameEngine;
  public readonly events: EventDispatcher;
  public readonly plugins: PluginManager;

  constructor(socket: WASocket) {
    this.raw = socket;
    this.messages = new MessageManager(socket);
    this.calls = new CallManager(socket);
    this.groups = new GroupManager(socket);
    this.newsletters = new NewsletterManager(socket);
    this.games = new GameEngine(socket);
    this.events = new EventDispatcher(socket);
    this.plugins = new PluginManager(this);
  }

  /**
   * Return live capabilities and support breakdown of WhatsApp protocol features
   */
  public features(): FrameworkCapabilities {
    return detectCapabilities();
  }

  /**
   * Register a Chama plugin
   */
  public async use(plugin: ChamaPlugin): Promise<this> {
    await this.plugins.use(plugin);
    return this;
  }

  // ==========================================
  // Direct High-Level Message Methods
  // ==========================================

  public async sendText(jid: string, text: string, options?: SendTextOptions): Promise<WAMessage | undefined> {
    return await this.messages.sendText(jid, text, options);
  }

  public async sendImage(jid: string, image: WAMediaUpload, options?: SendMediaOptions): Promise<WAMessage | undefined> {
    return await this.messages.sendImage(jid, image, options);
  }

  public async sendVideo(jid: string, video: WAMediaUpload, options?: SendMediaOptions & { gifPlayback?: boolean }): Promise<WAMessage | undefined> {
    return await this.messages.sendVideo(jid, video, options);
  }

  public async sendAudio(jid: string, audio: WAMediaUpload, options?: SendAudioOptions): Promise<WAMessage | undefined> {
    return await this.messages.sendAudio(jid, audio, options);
  }

  public async sendVoiceNote(jid: string, audio: WAMediaUpload, options?: Omit<SendAudioOptions, 'ptt'>): Promise<WAMessage | undefined> {
    return await this.messages.sendVoiceNote(jid, audio, options);
  }

  public async sendDocument(jid: string, doc: WAMediaUpload, options: SendMediaOptions & { fileName: string; mimetype: string }): Promise<WAMessage | undefined> {
    return await this.messages.sendDocument(jid, doc, options);
  }

  public async sendSticker(jid: string, sticker: WAMediaUpload, options?: any): Promise<WAMessage | undefined> {
    return await this.messages.sendSticker(jid, sticker, options);
  }

  public async sendLocation(jid: string, options: SendLocationOptions): Promise<WAMessage | undefined> {
    return await this.messages.sendLocation(jid, options);
  }

  public async sendContact(jid: string, contacts: SendContactItem | SendContactItem[], options?: any): Promise<WAMessage | undefined> {
    return await this.messages.sendContact(jid, contacts, options);
  }

  public async sendPoll(jid: string, options: SendPollOptions): Promise<WAMessage | undefined> {
    return await this.messages.sendPoll(jid, options);
  }

  public async sendInteractive(jid: string, options: InteractiveMessageOptions): Promise<WAMessage | undefined> {
    return await this.messages.sendInteractive(jid, options);
  }

  public async sendCarousel(jid: string, summary: string, cards: CarouselCardOptions[]): Promise<WAMessage | undefined> {
    return await this.messages.sendCarousel(jid, summary, cards);
  }

  public async sendRichResponse(jid: string, options: RichResponseOptions): Promise<WAMessage | undefined> {
    return await this.messages.sendRichResponse(jid, options);
  }

  public async sendGameLaunchCard(jid: string, options: GameLaunchCardOptions): Promise<WAMessage | undefined> {
    return await this.games.sendGameLaunchCard(jid, options);
  }

  public async sendRichHTMLCard(jid: string, title: string, bodyText: string, linkUrl?: string, footer?: string): Promise<WAMessage | undefined> {
    return await this.games.sendRichHTMLCard(jid, title, bodyText, linkUrl, footer);
  }

  public async sendEvent(jid: string, options: SendEventOptions): Promise<WAMessage | undefined> {
    return await this.messages.sendEvent(jid, options);
  }

  public async sendAlbum(jid: string, options: SendAlbumOptions): Promise<string> {
    return await this.messages.sendAlbum(jid, options);
  }

  public async editMessage(jid: string, targetKey: WAMessageKey, newText: string): Promise<WAMessage | undefined> {
    return await this.messages.editMessage(jid, targetKey, newText);
  }

  public async deleteMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined> {
    return await this.messages.deleteMessage(jid, targetKey);
  }

  public async pinMessage(jid: string, targetKey: WAMessageKey, options?: PinMessageOptions): Promise<WAMessage | undefined> {
    return await this.messages.pinMessage(jid, targetKey, options);
  }

  public async unpinMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined> {
    return await this.messages.unpinMessage(jid, targetKey);
  }

  public async sendReaction(jid: string, emoji: string, targetKey: WAMessageKey): Promise<WAMessage | undefined> {
    return await this.messages.sendReaction(jid, emoji, targetKey);
  }

  // ==========================================
  // Direct High-Level Call Methods
  // ==========================================

  public async createVoiceCallLink(event?: { startTime: number }, timeoutMs?: number): Promise<CallLinkResult> {
    return await this.calls.createVoiceCallLink(event, timeoutMs);
  }

  public async createVideoCallLink(event?: { startTime: number }, timeoutMs?: number): Promise<CallLinkResult> {
    return await this.calls.createVideoCallLink(event, timeoutMs);
  }

  public async createCallLink(options: CallLinkOptions): Promise<CallLinkResult> {
    return await this.calls.createCallLink(options);
  }

  public async rejectCall(callId: string, fromJid: string): Promise<void> {
    return await this.calls.rejectCall(callId, fromJid);
  }

  public async call(toJid: string, options: { type: 'audio' | 'video' }): Promise<{ callId: string; status: string }> {
    return await this.calls.call(toJid, options);
  }

  /**
   * Start a real-time Video Call Streaming Session playing a video file
   */
  public async streamVideoCall(toJid: string, options: VideoStreamOptions): Promise<VideoStreamSession> {
    return await this.calls.streamVideoCall(toJid, options);
  }

  public async stopVideoStream(): Promise<void> {
    await this.calls.stopVideoStream();
  }

  // ==========================================
  // Direct Event Helpers
  // ==========================================

  public onMessage(handler: (ctx: MessageContext) => void | Promise<void>): () => void {
    return this.events.onMessage(handler);
  }

  public onCall(handler: import('../types/calls.js').CallEventListener): () => void {
    return this.calls.onCall(handler);
  }

  public onConnectionUpdate(handler: (state: Partial<import('@whiskeysockets/baileys').ConnectionState>) => void | Promise<void>): () => void {
    return this.events.onConnectionUpdate(handler);
  }
}

/**
 * Factory to create a customized ChamaSocket instance
 */
export function makeChamaSocket(config: UserFacingSocketConfig): ChamaSocket {
  const rawSocket = makeWASocket(config);
  return new ChamaSocket(rawSocket);
}
