import { proto } from '../../index.js';
import type { RichResponseOptions } from '../types/interactive.js';
/**
 * Fluent builder for Rich Responses (Title, Subtitle, Body, Footer, Media, Lists, Buttons)
 */
export declare class RichResponseBuilder {
    private title?;
    private subtitle?;
    private bodyText;
    private footerText?;
    private buttonsBuilder;
    private isViewOnce;
    setTitle(title: string, subtitle?: string): this;
    setBody(text: string): this;
    setFooter(text: string): this;
    addQuickReply(displayText: string, id: string): this;
    addUrl(displayText: string, url: string): this;
    addCall(displayText: string, phone: string): this;
    addCopyCode(displayText: string, code: string): this;
    addMenu(title: string, sections: import('../types/interactive.js').ListSectionItem[]): this;
    setViewOnce(viewOnce: boolean): this;
    build(): proto.IMessage;
    static fromOptions(options: RichResponseOptions): proto.IMessage;
}
//# sourceMappingURL=RichResponseBuilder.d.ts.map