import type { proto, WAMessage, WAMessageKey } from '@whiskeysockets/baileys';
export interface BaseSendOptions {
    quoted?: WAMessage | {
        key: WAMessageKey;
        message?: proto.IMessage;
    };
    ephemeralExpiration?: number;
    viewOnce?: boolean;
    mentions?: string[];
}
export interface SendTextOptions extends BaseSendOptions {
    linkPreview?: boolean;
    linkPreviewTitle?: string;
    linkPreviewDescription?: string;
    linkPreviewThumbnail?: Buffer | Uint8Array;
    linkPreviewUrl?: string;
}
export interface SendMediaOptions extends BaseSendOptions {
    caption?: string;
    fileName?: string;
    mimetype?: string;
    jpegThumbnail?: Buffer | Uint8Array;
}
export interface SendAudioOptions extends BaseSendOptions {
    ptt?: boolean;
    mimetype?: string;
    seconds?: number;
}
export interface SendLocationOptions extends BaseSendOptions {
    degreesLatitude: number;
    degreesLongitude: number;
    name?: string;
    address?: string;
    url?: string;
}
export interface SendContactItem {
    displayName: string;
    vcard: string;
}
export interface SendPollOptions extends BaseSendOptions {
    name: string;
    values: string[];
    selectableCount?: number;
    toAnnouncementGroup?: boolean;
}
export interface SendAlbumOptions extends BaseSendOptions {
    images?: Array<Buffer | Uint8Array | {
        url: string;
    }>;
    videos?: Array<Buffer | Uint8Array | {
        url: string;
    }>;
    caption?: string;
}
export interface SendEventOptions extends BaseSendOptions {
    name: string;
    description?: string;
    startTime: number | Date;
    endTime?: number | Date;
    location?: {
        degreesLatitude?: number;
        degreesLongitude?: number;
        name?: string;
        address?: string;
    };
    joinLink?: string;
    isCanceled?: boolean;
    extraGuestsAllowed?: boolean;
}
export interface PinMessageOptions {
    durationSeconds?: number;
}
//# sourceMappingURL=messages.d.ts.map