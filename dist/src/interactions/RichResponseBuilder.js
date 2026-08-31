import { InteractiveBuilder } from './InteractiveBuilder.js';
import { NativeFlowBuilder } from './NativeFlowBuilder.js';
/**
 * Fluent builder for Rich Responses (Title, Subtitle, Body, Footer, Media, Lists, Buttons)
 */
export class RichResponseBuilder {
    title;
    subtitle;
    bodyText = '';
    footerText;
    buttonsBuilder = new NativeFlowBuilder();
    isViewOnce = false;
    setTitle(title, subtitle) {
        this.title = title;
        this.subtitle = subtitle;
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
    addQuickReply(displayText, id) {
        this.buttonsBuilder.addQuickReply(displayText, id);
        return this;
    }
    addUrl(displayText, url) {
        this.buttonsBuilder.addUrl(displayText, url);
        return this;
    }
    addCall(displayText, phone) {
        this.buttonsBuilder.addCall(displayText, phone);
        return this;
    }
    addCopyCode(displayText, code) {
        this.buttonsBuilder.addCopyCode(displayText, code);
        return this;
    }
    addMenu(title, sections) {
        this.buttonsBuilder.addSingleSelect(title, sections);
        return this;
    }
    setViewOnce(viewOnce) {
        this.isViewOnce = viewOnce;
        return this;
    }
    build() {
        const buttons = this.buttonsBuilder.build();
        return InteractiveBuilder.fromOptions({
            header: this.title ? { title: this.title, subtitle: this.subtitle } : undefined,
            body: this.bodyText,
            footer: this.footerText,
            buttons: buttons.length > 0 ? buttons : undefined,
            viewOnce: this.isViewOnce
        });
    }
    static fromOptions(options) {
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
                builder.buttonsBuilder.addCustom(btn.name, btn.buttonParamsJson);
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
//# sourceMappingURL=RichResponseBuilder.js.map