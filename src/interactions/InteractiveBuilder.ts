import { proto } from '@whiskeysockets/baileys';
import type {
  CarouselCardOptions,
  InteractiveHeaderOptions,
  InteractiveMessageOptions,
  NativeFlowButtonDef
} from '../types/interactive.js';
import { ValidationError } from '../core/Errors.js';
import { NativeFlowBuilder } from './NativeFlowBuilder.js';

/**
 * Fluent builder for WhatsApp Interactive Messages (Native Flow & Interactive Cards)
 */
export class InteractiveBuilder {
  private headerTitle?: string;
  private headerSubtitle?: string;
  private headerHasMedia = false;
  private bodyText = '';
  private footerText?: string;
  private buttons: NativeFlowButtonDef[] = [];
  private carouselCards?: CarouselCardOptions[];
  private contextInfo?: proto.IContextInfo;
  private isViewOnce = false;

  public setHeader(title: string, subtitle?: string): this {
    this.headerTitle = title;
    this.headerSubtitle = subtitle;
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

  public addButton(button: NativeFlowButtonDef): this {
    this.buttons.push(button);
    return this;
  }

  public setButtons(buttons: NativeFlowButtonDef[] | ((builder: NativeFlowBuilder) => NativeFlowBuilder)): this {
    if (typeof buttons === 'function') {
      const builder = new NativeFlowBuilder();
      this.buttons = buttons(builder).build();
    } else {
      this.buttons = buttons;
    }
    return this;
  }

  public setCarousel(cards: CarouselCardOptions[]): this {
    this.carouselCards = cards;
    return this;
  }

  public setContextInfo(contextInfo: proto.IContextInfo): this {
    this.contextInfo = contextInfo;
    return this;
  }

  public setViewOnce(viewOnce: boolean): this {
    this.isViewOnce = viewOnce;
    return this;
  }

  /**
   * Builds the complete proto.IMessage object ready for sending via relayMessage or generateWAMessageFromContent
   */
  public build(): proto.IMessage {
    if (!this.bodyText && (!this.carouselCards || this.carouselCards.length === 0)) {
      throw new ValidationError('Interactive message must have body text or carousel cards', 'body');
    }

    const interactiveMessage: proto.Message.IInteractiveMessage = {};

    // Header
    if (this.headerTitle || this.headerSubtitle) {
      interactiveMessage.header = proto.Message.InteractiveMessage.Header.create({
        title: this.headerTitle,
        subtitle: this.headerSubtitle,
        hasMediaAttachment: this.headerHasMedia
      });
    }

    // Body
    if (this.bodyText) {
      interactiveMessage.body = proto.Message.InteractiveMessage.Body.create({
        text: this.bodyText
      });
    }

    // Footer
    if (this.footerText) {
      interactiveMessage.footer = proto.Message.InteractiveMessage.Footer.create({
        text: this.footerText
      });
    }

    // Context Info
    if (this.contextInfo) {
      interactiveMessage.contextInfo = this.contextInfo;
    }

    // Carousel or Native Flow
    if (this.carouselCards && this.carouselCards.length > 0) {
      const protoCards: proto.Message.IInteractiveMessage[] = this.carouselCards.map((card) => {
        const cHeader =
          typeof card.header === 'string'
            ? proto.Message.InteractiveMessage.Header.create({ title: card.header })
            : card.header
            ? proto.Message.InteractiveMessage.Header.create({
                title: card.header.title,
                subtitle: card.header.subtitle,
                hasMediaAttachment: card.header.hasMediaAttachment
              })
            : undefined;

        const cBody = proto.Message.InteractiveMessage.Body.create({
          text: typeof card.body === 'string' ? card.body : card.body.text
        });

        const cFooter = card.footer
          ? proto.Message.InteractiveMessage.Footer.create({
              text: typeof card.footer === 'string' ? card.footer : card.footer.text
            })
          : undefined;

        const cardButtons = card.buttons || [];
        const cNativeFlow = proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons: cardButtons.map((b) => ({
            name: b.name,
            buttonParamsJson: typeof b.buttonParamsJson === 'string' ? b.buttonParamsJson : JSON.stringify(b.buttonParamsJson)
          })),
          messageParamsJson: '{}',
          messageVersion: 1
        });

        return proto.Message.InteractiveMessage.create({
          header: cHeader,
          body: cBody,
          footer: cFooter,
          nativeFlowMessage: cNativeFlow
        });
      });

      interactiveMessage.carouselMessage = proto.Message.InteractiveMessage.CarouselMessage.create({
        cards: protoCards,
        messageVersion: 1
      });
    } else if (this.buttons.length > 0) {
      interactiveMessage.nativeFlowMessage = proto.Message.InteractiveMessage.NativeFlowMessage.create({
        buttons: this.buttons.map((b) => ({
          name: b.name,
          buttonParamsJson: typeof b.buttonParamsJson === 'string' ? b.buttonParamsJson : JSON.stringify(b.buttonParamsJson)
        })),
        messageParamsJson: '{}',
        messageVersion: 1
      });
    }

    const payload: proto.IMessage = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create(interactiveMessage)
        }
      }
    };

    return payload;
  }

  /**
   * Static helper to build from options object
   */
  public static fromOptions(options: InteractiveMessageOptions): proto.IMessage {
    const builder = new InteractiveBuilder();

    if (options.header) {
      if (typeof options.header === 'string') {
        builder.setHeader(options.header);
      } else {
        builder.setHeader(options.header.title || '', options.header.subtitle);
      }
    }

    if (typeof options.body === 'string') {
      builder.setBody(options.body);
    } else {
      builder.setBody(options.body.text);
    }

    if (options.footer) {
      if (typeof options.footer === 'string') {
        builder.setFooter(options.footer);
      } else {
        builder.setFooter(options.footer.text);
      }
    }

    if (options.buttons) {
      builder.setButtons(options.buttons);
    }

    if (options.carouselCards) {
      builder.setCarousel(options.carouselCards);
    }

    if (options.contextInfo) {
      builder.setContextInfo(options.contextInfo);
    }

    if (options.viewOnce !== undefined) {
      builder.setViewOnce(options.viewOnce);
    }

    return builder.build();
  }
}
