import type { proto, WAMessageKey, WAMessage } from '@whiskeysockets/baileys';

/**
 * Supported Native Flow button action names in WhatsApp Web / Multi-Device
 */
export type NativeFlowButtonName =
  | 'quick_reply'
  | 'cta_url'
  | 'cta_call'
  | 'cta_copy'
  | 'single_select'
  | 'cta_reminder'
  | 'review_and_pay'
  | 'galaxy_message'
  | 'payment_method'
  | 'open_webview';

export interface QuickReplyButtonParams {
  display_text: string;
  id: string;
}

export interface CtaUrlButtonParams {
  display_text: string;
  url: string;
  merchant_url?: string;
}

export interface CtaCallButtonParams {
  display_text: string;
  phone_number: string;
}

export interface CtaCopyButtonParams {
  display_text: string;
  id?: string;
  copy_code: string;
}

export interface ListRowItem {
  id: string;
  title: string;
  description?: string;
  header?: string;
}

export interface ListSectionItem {
  title: string;
  highlight_label?: string;
  rows: ListRowItem[];
}

export interface SingleSelectButtonParams {
  title: string;
  sections: ListSectionItem[];
}

export type NativeButtonParams =
  | QuickReplyButtonParams
  | CtaUrlButtonParams
  | CtaCallButtonParams
  | CtaCopyButtonParams
  | SingleSelectButtonParams
  | Record<string, unknown>;

export interface NativeFlowButtonDef {
  name: NativeFlowButtonName | string;
  buttonParamsJson: string | NativeButtonParams | Record<string, unknown>;
}

export interface InteractiveMediaHeader {
  type?: 'image' | 'video' | 'document' | 'location';
  media?: Buffer | Uint8Array | { url: string };
  jpegThumbnail?: Buffer | Uint8Array | string;
  fileName?: string;
  mimetype?: string;
  title?: string;
  subtitle?: string;
  hasMediaAttachment?: boolean;
}

export interface InteractiveHeaderOptions {
  title?: string;
  subtitle?: string;
  hasMediaAttachment?: boolean;
  image?: Buffer | Uint8Array | { url: string };
  video?: Buffer | Uint8Array | { url: string };
  document?: Buffer | Uint8Array | { url: string };
  jpegThumbnail?: Buffer | Uint8Array | string;
  location?: {
    degreesLatitude: number;
    degreesLongitude: number;
    name?: string;
    address?: string;
  };
}

export interface InteractiveBodyOptions {
  text: string;
}

export interface InteractiveFooterOptions {
  text: string;
}

export interface InteractiveMessageOptions {
  header?: InteractiveHeaderOptions | string;
  body: InteractiveBodyOptions | string;
  footer?: InteractiveFooterOptions | string;
  buttons?: NativeFlowButtonDef[];
  contextInfo?: proto.IContextInfo;
  carouselCards?: CarouselCardOptions[];
  viewOnce?: boolean;
}

export interface CarouselCardOptions {
  header?: InteractiveHeaderOptions | string;
  body: InteractiveBodyOptions | string;
  footer?: InteractiveFooterOptions | string;
  buttons?: NativeFlowButtonDef[];
}

export interface RichResponseOptions {
  title?: string;
  subtitle?: string;
  body: string;
  footer?: string;
  media?: Buffer | Uint8Array | { url: string };
  mediaType?: 'image' | 'video' | 'document';
  buttons?: NativeFlowButtonDef[];
  sections?: ListSectionItem[];
  quoted?: WAMessage | { key: WAMessageKey; message?: proto.IMessage | null };
  mentions?: string[];
  viewOnce?: boolean;
}
