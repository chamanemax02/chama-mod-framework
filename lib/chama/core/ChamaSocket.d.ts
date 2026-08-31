import { type UserFacingSocketConfig, type WASocket, type WAMessage, type WAMessageKey, type WAMediaUpload } from '../../index.js';
import { MessageManager } from '../messages/MessageManager.js';
import { CallManager } from '../calls/CallManager.js';
import { GroupManager } from '../groups/GroupManager.js';
import { NewsletterManager } from '../newsletters/NewsletterManager.js';
import { GameEngine } from '../games/GameEngine.js';
import { EventDispatcher, type MessageContext } from '../events/EventDispatcher.js';
import { PluginManager } from '../plugins/PluginManager.js';
import type { ChamaPlugin } from '../plugins/types.js';
import { type FrameworkCapabilities } from './Capabilities.js';
import type { SendTextOptions, SendMediaOptions, SendAudioOptions, SendLocationOptions, SendContactItem, SendPollOptions, SendAlbumOptions, SendEventOptions, PinMessageOptions } from '../types/messages.js';
import type { InteractiveMessageOptions, RichResponseOptions, CarouselCardOptions } from '../types/interactive.js';
import type { GameLaunchCardOptions } from '../types/games.js';
import type { CallLinkOptions, CallLinkResult, VideoStreamOptions, VideoStreamSession } from '../types/calls.js';
export declare class ChamaSocket {
    readonly raw: WASocket;
    readonly messages: MessageManager;
    readonly calls: CallManager;
    readonly groups: GroupManager;
    readonly newsletters: NewsletterManager;
    readonly games: GameEngine;
    readonly events: EventDispatcher;
    readonly plugins: PluginManager;
    constructor(socket: WASocket);
    /**
     * Return live capabilities and support breakdown of WhatsApp protocol features
     */
    features(): FrameworkCapabilities;
    /**
     * Register a Chama plugin
     */
    use(plugin: ChamaPlugin): Promise<this>;
    sendText(jid: string, text: string, options?: SendTextOptions): Promise<WAMessage | undefined>;
    sendImage(jid: string, image: WAMediaUpload, options?: SendMediaOptions): Promise<WAMessage | undefined>;
    sendVideo(jid: string, video: WAMediaUpload, options?: SendMediaOptions & {
        gifPlayback?: boolean;
    }): Promise<WAMessage | undefined>;
    sendAudio(jid: string, audio: WAMediaUpload, options?: SendAudioOptions): Promise<WAMessage | undefined>;
    sendVoiceNote(jid: string, audio: WAMediaUpload, options?: Omit<SendAudioOptions, 'ptt'>): Promise<WAMessage | undefined>;
    sendDocument(jid: string, doc: WAMediaUpload, options: SendMediaOptions & {
        fileName: string;
        mimetype: string;
    }): Promise<WAMessage | undefined>;
    sendSticker(jid: string, sticker: WAMediaUpload, options?: any): Promise<WAMessage | undefined>;
    sendLocation(jid: string, options: SendLocationOptions): Promise<WAMessage | undefined>;
    sendContact(jid: string, contacts: SendContactItem | SendContactItem[], options?: any): Promise<WAMessage | undefined>;
    sendPoll(jid: string, options: SendPollOptions): Promise<WAMessage | undefined>;
    sendInteractive(jid: string, options: InteractiveMessageOptions): Promise<WAMessage | undefined>;
    sendCarousel(jid: string, summary: string, cards: CarouselCardOptions[]): Promise<WAMessage | undefined>;
    sendRichResponse(jid: string, options: RichResponseOptions): Promise<WAMessage | undefined>;
    sendGameLaunchCard(jid: string, options: GameLaunchCardOptions): Promise<WAMessage | undefined>;
    sendRichHTMLCard(jid: string, title: string, bodyText: string, linkUrl?: string, footer?: string): Promise<WAMessage | undefined>;
    sendEvent(jid: string, options: SendEventOptions): Promise<WAMessage | undefined>;
    sendAlbum(jid: string, options: SendAlbumOptions): Promise<string>;
    editMessage(jid: string, targetKey: WAMessageKey, newText: string): Promise<WAMessage | undefined>;
    deleteMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined>;
    pinMessage(jid: string, targetKey: WAMessageKey, options?: PinMessageOptions): Promise<WAMessage | undefined>;
    unpinMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined>;
    sendReaction(jid: string, emoji: string, targetKey: WAMessageKey): Promise<WAMessage | undefined>;
    createVoiceCallLink(event?: {
        startTime: number;
    }, timeoutMs?: number): Promise<CallLinkResult>;
    createVideoCallLink(event?: {
        startTime: number;
    }, timeoutMs?: number): Promise<CallLinkResult>;
    createCallLink(options: CallLinkOptions): Promise<CallLinkResult>;
    rejectCall(callId: string, fromJid: string): Promise<void>;
    call(toJid: string, options: {
        type: 'audio' | 'video';
    }): Promise<{
        callId: string;
        status: string;
    }>;
    /**
     * Start a real-time Video Call Streaming Session playing a video file
     */
    streamVideoCall(toJid: string, options: VideoStreamOptions): Promise<VideoStreamSession>;
    stopVideoStream(): Promise<void>;
    onMessage(handler: (ctx: MessageContext) => void | Promise<void>): () => void;
    onCall(handler: import('../types/calls.js').CallEventListener): () => void;
    onConnectionUpdate(handler: (state: Partial<import('../../index.js').ConnectionState>) => void | Promise<void>): () => void;
}
/**
 * Factory to create a customized ChamaSocket instance
 */
export declare function makeChamaSocket(config: UserFacingSocketConfig): ChamaSocket;
//# sourceMappingURL=ChamaSocket.d.ts.map