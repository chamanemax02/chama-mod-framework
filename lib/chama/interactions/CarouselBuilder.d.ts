import { proto } from '../../index.js';
import type { CarouselCardOptions, NativeFlowButtonDef } from '../types/interactive.js';
import { NativeFlowBuilder } from './NativeFlowBuilder.js';
/**
 * Fluent builder for multi-card Carousel Messages
 */
export declare class CarouselBuilder {
    private summaryText;
    private readonly cards;
    setSummary(text: string): this;
    addCard(title: string, body: string, footer?: string, buttons?: NativeFlowButtonDef[] | ((b: NativeFlowBuilder) => NativeFlowBuilder)): this;
    addCardWithOptions(card: CarouselCardOptions): this;
    build(): proto.IMessage;
}
//# sourceMappingURL=CarouselBuilder.d.ts.map