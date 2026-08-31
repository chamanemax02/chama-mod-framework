import { proto } from '@whiskeysockets/baileys';
import { ValidationError } from '../core/Errors.js';
export class AlbumEventManager {
    sock;
    constructor(sock) {
        this.sock = sock;
    }
    /**
     * Send WhatsApp Event Message (calendar event, meeting, or group scheduled call)
     */
    async sendEvent(jid, options) {
        if (!options.name || !options.startTime) {
            throw new ValidationError('Event requires name and startTime', 'sendEvent');
        }
        const startTimeSec = options.startTime instanceof Date
            ? Math.floor(options.startTime.getTime() / 1000)
            : typeof options.startTime === 'number' && options.startTime > 10000000000
                ? Math.floor(options.startTime / 1000)
                : Number(options.startTime);
        const endTimeSec = options.endTime
            ? options.endTime instanceof Date
                ? Math.floor(options.endTime.getTime() / 1000)
                : typeof options.endTime === 'number' && options.endTime > 10000000000
                    ? Math.floor(options.endTime / 1000)
                    : Number(options.endTime)
            : undefined;
        const eventPayload = {
            name: options.name,
            description: options.description || '',
            startTime: startTimeSec,
            endTime: endTimeSec,
            joinLink: options.joinLink,
            isCanceled: options.isCanceled || false,
            extraGuestsAllowed: options.extraGuestsAllowed ?? true,
            location: options.location
                ? {
                    degreesLatitude: options.location.degreesLatitude || 0,
                    degreesLongitude: options.location.degreesLongitude || 0,
                    name: options.location.name || ''
                }
                : undefined
        };
        const msgContent = {
            eventMessage: proto.Message.EventMessage.create(eventPayload)
        };
        const tag = this.sock.generateMessageTag();
        await this.sock.relayMessage(jid, msgContent, {
            messageId: tag
        });
        return {
            key: {
                remoteJid: jid,
                fromMe: true,
                id: tag
            },
            message: msgContent,
            messageTimestamp: Math.floor(Date.now() / 1000)
        };
    }
    /**
     * Send Album Message (multiple images/videos grouped natively)
     */
    async sendAlbum(jid, options) {
        const images = options.images || [];
        const videos = options.videos || [];
        if (images.length === 0 && videos.length === 0) {
            throw new ValidationError('Album must contain at least one image or video', 'sendAlbum');
        }
        const albumTag = this.sock.generateMessageTag();
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            await this.sock.sendMessage(jid, {
                image: img,
                caption: i === 0 ? options.caption : undefined
            }, {
                quoted: options.quoted
            });
        }
        for (let i = 0; i < videos.length; i++) {
            const vid = videos[i];
            await this.sock.sendMessage(jid, {
                video: vid,
                caption: images.length === 0 && i === 0 ? options.caption : undefined
            }, {
                quoted: options.quoted
            });
        }
        return albumTag;
    }
}
//# sourceMappingURL=AlbumEvent.js.map