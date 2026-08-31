import { type WASocket, type WAMessage } from '@whiskeysockets/baileys';
import type { SendAlbumOptions, SendEventOptions } from '../types/messages.js';
export declare class AlbumEventManager {
    private readonly sock;
    constructor(sock: WASocket);
    /**
     * Send WhatsApp Event Message (calendar event, meeting, or group scheduled call)
     */
    sendEvent(jid: string, options: SendEventOptions): Promise<WAMessage | undefined>;
    /**
     * Send Album Message (multiple images/videos grouped natively)
     */
    sendAlbum(jid: string, options: SendAlbumOptions): Promise<string>;
}
//# sourceMappingURL=AlbumEvent.d.ts.map