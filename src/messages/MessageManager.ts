import {
  proto,
  type WASocket,
  type WAMessage,
  type WAMessageKey,
  type WAMediaUpload
} from '@whiskeysockets/baileys';
import type {
  BaseSendOptions,
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
import { InteractiveBuilder } from '../interactions/InteractiveBuilder.js';
import { RichResponseBuilder } from '../interactions/RichResponseBuilder.js';
import { CarouselBuilder } from '../interactions/CarouselBuilder.js';
import { EditDeletePinManager } from './EditDeletePin.js';
import { AlbumEventManager } from './AlbumEvent.js';
import { ValidationError } from '../core/Errors.js';

export class MessageManager {
  private readonly editDeletePin: EditDeletePinManager;
  private readonly albumEvent: AlbumEventManager;

  constructor(private readonly sock: WASocket) {
    this.editDeletePin = new EditDeletePinManager(sock);
    this.albumEvent = new AlbumEventManager(sock);
  }

  /**
   * Helper to format thumbnail as Buffer or base64 string
   */
  private formatThumbnail(thumbnail?: Buffer | Uint8Array | string): string | undefined {
    if (!thumbnail) return undefined;
    if (typeof thumbnail === 'string') return thumbnail;
    return Buffer.from(thumbnail).toString('base64');
  }

  /**
   * Send a plain text or rich preview message
   */
  public async sendText(
    jid: string,
    text: string,
    options?: SendTextOptions
  ): Promise<WAMessage | undefined> {
    if (!text) {
      throw new ValidationError('Text cannot be empty', 'sendText');
    }

    return await this.sock.sendMessage(
      jid,
      {
        text,
        mentions: options?.mentions
      },
      {
        quoted: options?.quoted as any,
        ephemeralExpiration: options?.ephemeralExpiration
      }
    );
  }

  /**
   * Send Image message
   */
  public async sendImage(
    jid: string,
    image: WAMediaUpload,
    options?: SendMediaOptions
  ): Promise<WAMessage | undefined> {
    return await this.sock.sendMessage(
      jid,
      {
        image,
        caption: options?.caption,
        fileName: options?.fileName,
        mimetype: options?.mimetype || 'image/jpeg',
        jpegThumbnail: this.formatThumbnail(options?.jpegThumbnail),
        mentions: options?.mentions,
        viewOnce: options?.viewOnce
      },
      {
        quoted: options?.quoted as any,
        ephemeralExpiration: options?.ephemeralExpiration
      }
    );
  }

  /**
   * Send Video message / GIF
   */
  public async sendVideo(
    jid: string,
    video: WAMediaUpload,
    options?: SendMediaOptions & { gifPlayback?: boolean }
  ): Promise<WAMessage | undefined> {
    return await this.sock.sendMessage(
      jid,
      {
        video,
        caption: options?.caption,
        fileName: options?.fileName,
        mimetype: options?.mimetype || 'video/mp4',
        gifPlayback: options?.gifPlayback,
        jpegThumbnail: this.formatThumbnail(options?.jpegThumbnail),
        mentions: options?.mentions,
        viewOnce: options?.viewOnce
      },
      {
        quoted: options?.quoted as any,
        ephemeralExpiration: options?.ephemeralExpiration
      }
    );
  }

  /**
   * Send Audio / Voice note
   */
  public async sendAudio(
    jid: string,
    audio: WAMediaUpload,
    options?: SendAudioOptions
  ): Promise<WAMessage | undefined> {
    return await this.sock.sendMessage(
      jid,
      {
        audio,
        mimetype: options?.mimetype || 'audio/mp4',
        ptt: options?.ptt ?? false,
        seconds: options?.seconds
      },
      {
        quoted: options?.quoted as any,
        ephemeralExpiration: options?.ephemeralExpiration
      }
    );
  }

  /**
   * Send Voice Note (PTT)
   */
  public async sendVoiceNote(
    jid: string,
    audio: WAMediaUpload,
    options?: Omit<SendAudioOptions, 'ptt'>
  ): Promise<WAMessage | undefined> {
    return await this.sendAudio(jid, audio, { ...options, ptt: true, mimetype: 'audio/ogg; codecs=opus' });
  }

  /**
   * Send Document
   */
  public async sendDocument(
    jid: string,
    document: WAMediaUpload,
    options: SendMediaOptions & { fileName: string; mimetype: string }
  ): Promise<WAMessage | undefined> {
    return await this.sock.sendMessage(
      jid,
      {
        document,
        fileName: options.fileName,
        mimetype: options.mimetype,
        caption: options.caption,
        jpegThumbnail: this.formatThumbnail(options.jpegThumbnail),
        mentions: options.mentions
      },
      {
        quoted: options?.quoted as any,
        ephemeralExpiration: options?.ephemeralExpiration
      }
    );
  }

  /**
   * Send Sticker
   */
  public async sendSticker(
    jid: string,
    sticker: WAMediaUpload,
    options?: BaseSendOptions
  ): Promise<WAMessage | undefined> {
    return await this.sock.sendMessage(
      jid,
      {
        sticker
      },
      {
        quoted: options?.quoted as any,
        ephemeralExpiration: options?.ephemeralExpiration
      }
    );
  }

  /**
   * Send Location
   */
  public async sendLocation(
    jid: string,
    options: SendLocationOptions
  ): Promise<WAMessage | undefined> {
    return await this.sock.sendMessage(
      jid,
      {
        location: {
          degreesLatitude: options.degreesLatitude,
          degreesLongitude: options.degreesLongitude,
          name: options.name,
          address: options.address,
          url: options.url
        }
      },
      {
        quoted: options?.quoted as any,
        ephemeralExpiration: options?.ephemeralExpiration
      }
    );
  }

  /**
   * Send Contact card
   */
  public async sendContact(
    jid: string,
    contacts: SendContactItem | SendContactItem[],
    options?: BaseSendOptions
  ): Promise<WAMessage | undefined> {
    const list = Array.isArray(contacts) ? contacts : [contacts];
    return await this.sock.sendMessage(
      jid,
      {
        contacts: {
          displayName: list[0]?.displayName || 'Contact',
          contacts: list
        }
      },
      {
        quoted: options?.quoted as any,
        ephemeralExpiration: options?.ephemeralExpiration
      }
    );
  }

  /**
   * Send Poll
   */
  public async sendPoll(
    jid: string,
    options: SendPollOptions
  ): Promise<WAMessage | undefined> {
    if (!options.name || !options.values || options.values.length < 2) {
      throw new ValidationError('Poll requires a name and at least 2 options', 'sendPoll');
    }

    return await this.sock.sendMessage(
      jid,
      {
        poll: {
          name: options.name,
          values: options.values,
          selectableCount: options.selectableCount || 1,
          toAnnouncementGroup: options.toAnnouncementGroup
        }
      },
      {
        quoted: options?.quoted as any,
        ephemeralExpiration: options?.ephemeralExpiration
      }
    );
  }

  /**
   * Send Interactive Message (Native Flow buttons, menus, quick replies)
   */
  public async sendInteractive(
    jid: string,
    options: InteractiveMessageOptions
  ): Promise<WAMessage | undefined> {
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
  public async sendCarousel(
    jid: string,
    summary: string,
    cards: CarouselCardOptions[]
  ): Promise<WAMessage | undefined> {
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
  public async sendRichResponse(
    jid: string,
    options: RichResponseOptions
  ): Promise<WAMessage | undefined> {
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
  public async editMessage(jid: string, targetKey: WAMessageKey, newText: string) {
    return await this.editDeletePin.editMessage(jid, targetKey, newText);
  }

  public async deleteMessage(jid: string, targetKey: WAMessageKey) {
    return await this.editDeletePin.deleteMessage(jid, targetKey);
  }

  public async pinMessage(jid: string, targetKey: WAMessageKey, options?: PinMessageOptions) {
    return await this.editDeletePin.pinMessage(jid, targetKey, options);
  }

  public async unpinMessage(jid: string, targetKey: WAMessageKey) {
    return await this.editDeletePin.unpinMessage(jid, targetKey);
  }

  public async sendReaction(jid: string, emoji: string, targetKey: WAMessageKey) {
    return await this.editDeletePin.sendReaction(jid, emoji, targetKey);
  }

  public async sendEvent(jid: string, options: SendEventOptions) {
    return await this.albumEvent.sendEvent(jid, options);
  }

  public async sendAlbum(jid: string, options: SendAlbumOptions) {
    return await this.albumEvent.sendAlbum(jid, options);
  }
}
