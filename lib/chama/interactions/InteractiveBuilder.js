import { proto } from '../../index.js';
import { ValidationError } from '../core/Errors.js';
import { NativeFlowBuilder } from './NativeFlowBuilder.js';
/**
 * Fluent builder for WhatsApp Interactive Messages (Native Flow & Interactive Cards)
 */
export class InteractiveBuilder {
    headerTitle;
    headerSubtitle;
    headerHasMedia = false;
    bodyText = '';
    footerText;
    buttons = [];
    carouselCards;
    contextInfo;
    isViewOnce = false;
    setHeader(title, subtitle) {
        this.headerTitle = title;
        this.headerSubtitle = subtitle;
        return this;
    }
    setBody(text) {
        this.bodyText = text;
        return this;
    }
    setFooter(text) {
        this.footerText = text;
        return this;
    }
    addButton(button) {
        this.buttons.push(button);
        return this;
    }
    setButtons(buttons) {
        if (typeof buttons === 'function') {
            const builder = new NativeFlowBuilder();
            this.buttons = buttons(builder).build();
        }
        else {
            this.buttons = buttons;
        }
        return this;
    }
    setCarousel(cards) {
        this.carouselCards = cards;
        return this;
    }
    setContextInfo(contextInfo) {
        this.contextInfo = contextInfo;
        return this;
    }
    setViewOnce(viewOnce) {
        this.isViewOnce = viewOnce;
        return this;
    }
    /**
     * Builds the complete proto.IMessage object ready for sending via relayMessage or generateWAMessageFromContent
     */
    build() {
        if (!this.bodyText && (!this.carouselCards || this.carouselCards.length === 0)) {
            throw new ValidationError('Interactive message must have body text or carousel cards', 'body');
        }
        const interactiveMessage = {};
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
            const protoCards = this.carouselCards.map((card) => {
                const cHeader = typeof card.header === 'string'
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
        }
        else if (this.buttons.length > 0) {
            interactiveMessage.nativeFlowMessage = proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: this.buttons.map((b) => ({
                    name: b.name,
                    buttonParamsJson: typeof b.buttonParamsJson === 'string' ? b.buttonParamsJson : JSON.stringify(b.buttonParamsJson)
                })),
                messageParamsJson: '{}',
                messageVersion: 1
            });
        }
        const innerPayload = {
            messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create(interactiveMessage)
        };
        if (this.isViewOnce) {
            return {
                viewOnceMessage: {
                    message: innerPayload
                }
            };
        }
        return innerPayload;
    }
    /**
     * Static helper to build from options object
     */
    static fromOptions(options) {
        const builder = new InteractiveBuilder();
        if (options.header) {
            if (typeof options.header === 'string') {
                builder.setHeader(options.header);
            }
            else {
                builder.setHeader(options.header.title || '', options.header.subtitle);
            }
        }
        if (typeof options.body === 'string') {
            builder.setBody(options.body);
        }
        else {
            builder.setBody(options.body.text);
        }
        if (options.footer) {
            if (typeof options.footer === 'string') {
                builder.setFooter(options.footer);
            }
            else {
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
//# sourceMappingURL=InteractiveBuilder.js.map