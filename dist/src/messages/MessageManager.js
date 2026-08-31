import { InteractiveBuilder } from '../interactions/InteractiveBuilder.js';
import { RichResponseBuilder } from '../interactions/RichResponseBuilder.js';
import { CarouselBuilder } from '../interactions/CarouselBuilder.js';
import { EditDeletePinManager } from './EditDeletePin.js';
import { AlbumEventManager } from './AlbumEvent.js';
import { ValidationError } from '../core/Errors.js';
export class MessageManager {
    sock;
    editDeletePin;
    albumEvent;
    constructor(sock) {
        this.sock = sock;
        this.editDeletePin = new EditDeletePinManager(sock);
        this.albumEvent = new AlbumEventManager(sock);
    }
    /**
     * Helper to format thumbnail as Buffer or base64 string
     */
    formatThumbnail(thumbnail) {
        if (!thumbnail)
            return undefined;
        if (typeof thumbnail === 'string')
            return thumbnail;
        return Buffer.from(thumbnail).toString('base64');
    }
    /**
     * Send a plain text or rich preview message
     */
    async sendText(jid, text, options) {
        if (!text) {
            throw new ValidationError('Text cannot be empty', 'sendText');
        }
        return await this.sock.sendMessage(jid, {
            text,
            mentions: options?.mentions
        }, {
            quoted: options?.quoted,
            ephemeralExpiration: options?.ephemeralExpiration
        });
    }
    /**
     * Send Image message
     */
    async sendImage(jid, image, options) {
        return await this.sock.sendMessage(jid, {
            image,
            caption: options?.caption,
            fileName: options?.fileName,
            mimetype: options?.mimetype || 'image/jpeg',
            jpegThumbnail: this.formatThumbnail(options?.jpegThumbnail),
            mentions: options?.mentions,
            viewOnce: options?.viewOnce
        }, {
            quoted: options?.quoted,
            ephemeralExpiration: options?.ephemeralExpiration
        });
    }
    /**
     * Send Video message / GIF
     */
    async sendVideo(jid, video, options) {
        return await this.sock.sendMessage(jid, {
            video,
            caption: options?.caption,
            fileName: options?.fileName,
            mimetype: options?.mimetype || 'video/mp4',
            gifPlayback: options?.gifPlayback,
            jpegThumbnail: this.formatThumbnail(options?.jpegThumbnail),
            mentions: options?.mentions,
            viewOnce: options?.viewOnce
        }, {
            quoted: options?.quoted,
            ephemeralExpiration: options?.ephemeralExpiration
        });
    }
    /**
     * Send Audio / Voice note
     */
    async sendAudio(jid, audio, options) {
        return await this.sock.sendMessage(jid, {
            audio,
            mimetype: options?.mimetype || 'audio/mp4',
            ptt: options?.ptt ?? false,
            seconds: options?.seconds
        }, {
            quoted: options?.quoted,
            ephemeralExpiration: options?.ephemeralExpiration
        });
    }
    /**
     * Send Voice Note (PTT)
     */
    async sendVoiceNote(jid, audio, options) {
        return await this.sendAudio(jid, audio, { ...options, ptt: true, mimetype: 'audio/ogg; codecs=opus' });
    }
    /**
     * Send Document
     */
    async sendDocument(jid, document, options) {
        return await this.sock.sendMessage(jid, {
            document,
            fileName: options.fileName,
            mimetype: options.mimetype,
            caption: options.caption,
            jpegThumbnail: this.formatThumbnail(options.jpegThumbnail),
            mentions: options.mentions
        }, {
            quoted: options?.quoted,
            ephemeralExpiration: options?.ephemeralExpiration
        });
    }
    /**
     * Send Sticker
     */
    async sendSticker(jid, sticker, options) {
        return await this.sock.sendMessage(jid, {
            sticker
        }, {
            quoted: options?.quoted,
            ephemeralExpiration: options?.ephemeralExpiration
        });
    }
    /**
     * Send Location
     */
    async sendLocation(jid, options) {
        return await this.sock.sendMessage(jid, {
            location: {
                degreesLatitude: options.degreesLatitude,
                degreesLongitude: options.degreesLongitude,
                name: options.name,
                address: options.address,
                url: options.url
            }
        }, {
            quoted: options?.quoted,
            ephemeralExpiration: options?.ephemeralExpiration
        });
    }
    /**
     * Send Contact card
     */
    async sendContact(jid, contacts, options) {
        const list = Array.isArray(contacts) ? contacts : [contacts];
        return await this.sock.sendMessage(jid, {
            contacts: {
                displayName: list[0]?.displayName || 'Contact',
                contacts: list
            }
        }, {
            quoted: options?.quoted,
            ephemeralExpiration: options?.ephemeralExpiration
        });
    }
    /**
     * Send Poll
     */
    async sendPoll(jid, options) {
        if (!options.name || !options.values || options.values.length < 2) {
            throw new ValidationError('Poll requires a name and at least 2 options', 'sendPoll');
        }
        return await this.sock.sendMessage(jid, {
            poll: {
                name: options.name,
                values: options.values,
                selectableCount: options.selectableCount || 1,
                toAnnouncementGroup: options.toAnnouncementGroup
            }
        }, {
            quoted: options?.quoted,
            ephemeralExpiration: options?.ephemeralExpiration
        });
    }
    /**
     * Send Interactive Message (Native Flow buttons, menus, quick replies)
     */
    async sendInteractive(jid, options) {
        const protoMsg = InteractiveBuilder.fromOptions(options);
        const tag = this.sock.generateMessageTag();
        await this.sock.relayMessage(jid, protoMsg, {
            messageId: tag
        });
        return {
            key: {
                remoteJid: jid,
                fromMe: true,
                id: tag
            },
            message: protoMsg,
            messageTimestamp: Math.floor(Date.now() / 1000)
        };
    }
    /**
     * Send Carousel Cards
     */
    async sendCarousel(jid, summary, cards) {
        const builder = new CarouselBuilder();
        builder.setSummary(summary);
        for (const card of cards) {
            builder.addCardWithOptions(card);
        }
        const protoMsg = builder.build();
        const tag = this.sock.generateMessageTag();
        await this.sock.relayMessage(jid, protoMsg, {
            messageId: tag
        });
        return {
            key: {
                remoteJid: jid,
                fromMe: true,
                id: tag
            },
            message: protoMsg,
            messageTimestamp: Math.floor(Date.now() / 1000)
        };
    }
    /**
     * Send Rich Response (Title, Subtitle, Body, Buttons, Sections)
     */
    async sendRichResponse(jid, options) {
        const protoMsg = RichResponseBuilder.fromOptions(options);
        const tag = this.sock.generateMessageTag();
        await this.sock.relayMessage(jid, protoMsg, {
            messageId: tag
        });
        return {
            key: {
                remoteJid: jid,
                fromMe: true,
                id: tag
            },
            message: protoMsg,
            messageTimestamp: Math.floor(Date.now() / 1000)
        };
    }
    /**
     * Message edit, delete, pin, reaction, event, and album delegates
     */
    async editMessage(jid, targetKey, newText) {
        return await this.editDeletePin.editMessage(jid, targetKey, newText);
    }
    async deleteMessage(jid, targetKey) {
        return await this.editDeletePin.deleteMessage(jid, targetKey);
    }
    async pinMessage(jid, targetKey, options) {
        return await this.editDeletePin.pinMessage(jid, targetKey, options);
    }
    async unpinMessage(jid, targetKey) {
        return await this.editDeletePin.unpinMessage(jid, targetKey);
    }
    async sendReaction(jid, emoji, targetKey) {
        return await this.editDeletePin.sendReaction(jid, emoji, targetKey);
    }
    async sendEvent(jid, options) {
        return await this.albumEvent.sendEvent(jid, options);
    }
    async sendAlbum(jid, options) {
        return await this.albumEvent.sendAlbum(jid, options);
    }
}
//# sourceMappingURL=MessageManager.js.map