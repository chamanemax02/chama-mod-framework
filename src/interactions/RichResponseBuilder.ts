import { proto } from '@whiskeysockets/baileys';
import type { RichResponseOptions } from '../types/interactive.js';
import { InteractiveBuilder } from './InteractiveBuilder.js';
import { NativeFlowBuilder } from './NativeFlowBuilder.js';

/**
 * Fluent builder for Rich Responses (Title, Subtitle, Body, Footer, Media, Lists, Buttons)
 */
export class RichResponseBuilder {
  private title?: string;
  private subtitle?: string;
  private bodyText = '';
  private footerText?: string;
  private buttonsBuilder = new NativeFlowBuilder();
  private isViewOnce = false;

  public setTitle(title: string, subtitle?: string): this {
    this.title = title;
    this.subtitle = subtitle;
    return this;
  }

  public setBody(text: string): this {
    this.bodyText = text;
    return this;
  }

  public setFooter(text: string): this {
    this.footerText = text;
    return this;
  }

  public addQuickReply(displayText: string, id: string): this {
    this.buttonsBuilder.addQuickReply(displayText, id);
    return this;
  }

  public addUrl(displayText: string, url: string): this {
    this.buttonsBuilder.addUrl(displayText, url);
    return this;
  }

  public addCall(displayText: string, phone: string): this {
    this.buttonsBuilder.addCall(displayText, phone);
    return this;
  }

  public addCopyCode(displayText: string, code: string): this {
    this.buttonsBuilder.addCopyCode(displayText, code);
    return this;
  }

  public addMenu(title: string, sections: import('../types/interactive.js').ListSectionItem[]): this {
    this.buttonsBuilder.addSingleSelect(title, sections);
    return this;
  }

  public setViewOnce(viewOnce: boolean): this {
    this.isViewOnce = viewOnce;
    return this;
  }

  public build(): proto.IMessage {
    const buttons = this.buttonsBuilder.build();
    return InteractiveBuilder.fromOptions({
      header: this.title ? { title: this.title, subtitle: this.subtitle } : undefined,
      body: this.bodyText,
      footer: this.footerText,
      buttons: buttons.length > 0 ? buttons : undefined,
      viewOnce: this.isViewOnce
    });
  }

  public static fromOptions(options: RichResponseOptions): proto.IMessage {
    const builder = new RichResponseBuilder();

    if (options.title) {
      builder.setTitle(options.title, options.subtitle);
    }
    builder.setBody(options.body);

    if (options.footer) {
      builder.setFooter(options.footer);
    }

    if (options.buttons) {
      for (const btn of options.buttons) {
        builder.buttonsBuilder.addCustom(btn.name, btn.buttonParamsJson as any);
      }
    }

    if (options.sections && options.sections.length > 0) {
      builder.addMenu('Select Option', options.sections);
    }

    if (options.viewOnce !== undefined) {
      builder.setViewOnce(options.viewOnce);
    }

    return builder.build();
  }
}
