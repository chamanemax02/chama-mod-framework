import { type WASocket, type WAMessage, type WAMessageKey, type WAMediaUpload } from '@whiskeysockets/baileys';
import type { BaseSendOptions, SendTextOptions, SendMediaOptions, SendAudioOptions, SendLocationOptions, SendContactItem, SendPollOptions, SendAlbumOptions, SendEventOptions, PinMessageOptions } from '../types/messages.js';
import type { InteractiveMessageOptions, RichResponseOptions, CarouselCardOptions } from '../types/interactive.js';
export declare class MessageManager {
    private readonly sock;
    private readonly editDeletePin;
    private readonly albumEvent;
    constructor(sock: WASocket);
    /**
     * Helper to format thumbnail as Buffer or base64 string
     */
    private formatThumbnail;
    /**
     * Send a plain text or rich preview message
     */
    sendText(jid: string, text: string, options?: SendTextOptions): Promise<WAMessage | undefined>;
    /**
     * Send Image message
     */
    sendImage(jid: string, image: WAMediaUpload, options?: SendMediaOptions): Promise<WAMessage | undefined>;
    /**
     * Send Video message / GIF
     */
    sendVideo(jid: string, video: WAMediaUpload, options?: SendMediaOptions & {
        gifPlayback?: boolean;
    }): Promise<WAMessage | undefined>;
    /**
     * Send Audio / Voice note
     */
    sendAudio(jid: string, audio: WAMediaUpload, options?: SendAudioOptions): Promise<WAMessage | undefined>;
    /**
     * Send Voice Note (PTT)
     */
    sendVoiceNote(jid: string, audio: WAMediaUpload, options?: Omit<SendAudioOptions, 'ptt'>): Promise<WAMessage | undefined>;
    /**
     * Send Document
     */
    sendDocument(jid: string, document: WAMediaUpload, options: SendMediaOptions & {
        fileName: string;
        mimetype: string;
    }): Promise<WAMessage | undefined>;
    /**
     * Send Sticker
     */
    sendSticker(jid: string, sticker: WAMediaUpload, options?: BaseSendOptions): Promise<WAMessage | undefined>;
    /**
     * Send Location
     */
    sendLocation(jid: string, options: SendLocationOptions): Promise<WAMessage | undefined>;
    /**
     * Send Contact card
     */
    sendContact(jid: string, contacts: SendContactItem | SendContactItem[], options?: BaseSendOptions): Promise<WAMessage | undefined>;
    /**
     * Send Poll
     */
    sendPoll(jid: string, options: SendPollOptions): Promise<WAMessage | undefined>;
    /**
     * Send Interactive Message (Native Flow buttons, menus, quick replies)
     */
    sendInteractive(jid: string, options: InteractiveMessageOptions): Promise<WAMessage | undefined>;
    /**
     * Send Carousel Cards
     */
    sendCarousel(jid: string, summary: string, cards: CarouselCardOptions[]): Promise<WAMessage | undefined>;
    /**
     * Send Rich Response (Title, Subtitle, Body, Buttons, Sections)
     */
    sendRichResponse(jid: string, options: RichResponseOptions): Promise<WAMessage | undefined>;
    /**
     * Message edit, delete, pin, reaction, event, and album delegates
     */
    editMessage(jid: string, targetKey: WAMessageKey, newText: string): Promise<WAMessage | undefined>;
    deleteMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined>;
    pinMessage(jid: string, targetKey: WAMessageKey, options?: PinMessageOptions): Promise<WAMessage | undefined>;
    unpinMessage(jid: string, targetKey: WAMessageKey): Promise<WAMessage | undefined>;
    sendReaction(jid: string, emoji: string, targetKey: WAMessageKey): Promise<WAMessage | undefined>;
    sendEvent(jid: string, options: SendEventOptions): Promise<WAMessage | undefined>;
    sendAlbum(jid: string, options: SendAlbumOptions): Promise<string>;
}
//# sourceMappingURL=MessageManager.d.ts.map