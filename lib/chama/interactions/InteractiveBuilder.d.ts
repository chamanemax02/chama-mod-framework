import { proto } from '../../index.js';
import type { CarouselCardOptions, InteractiveMessageOptions, NativeFlowButtonDef } from '../types/interactive.js';
import { NativeFlowBuilder } from './NativeFlowBuilder.js';
/**
 * Fluent builder for WhatsApp Interactive Messages (Native Flow & Interactive Cards)
 */
export declare class InteractiveBuilder {
    private headerTitle?;
    private headerSubtitle?;
    private headerHasMedia;
    private bodyText;
    private footerText?;
    private buttons;
    private carouselCards?;
    private contextInfo?;
    private isViewOnce;
    setHeader(title: string, subtitle?: string): this;
    setBody(text: string): this;
    setFooter(text: string): this;
    addButton(button: NativeFlowButtonDef): this;
    setButtons(buttons: NativeFlowButtonDef[] | ((builder: NativeFlowBuilder) => NativeFlowBuilder)): this;
    setCarousel(cards: CarouselCardOptions[]): this;
    setContextInfo(contextInfo: proto.IContextInfo): this;
    setViewOnce(viewOnce: boolean): this;
    /**
     * Builds the complete proto.IMessage object ready for sending via relayMessage or generateWAMessageFromContent
     */
    build(): proto.IMessage;
    /**
     * Static helper to build from options object
     */
    static fromOptions(options: InteractiveMessageOptions): proto.IMessage;
}
//# sourceMappingURL=InteractiveBuilder.d.ts.map