import { proto } from '@whiskeysockets/baileys';
import type { CarouselCardOptions, NativeFlowButtonDef } from '../types/interactive.js';
import { ValidationError } from '../core/Errors.js';
import { InteractiveBuilder } from './InteractiveBuilder.js';
import { NativeFlowBuilder } from './NativeFlowBuilder.js';

/**
 * Fluent builder for multi-card Carousel Messages
 */
export class CarouselBuilder {
  private summaryText = '';
  private readonly cards: CarouselCardOptions[] = [];

  public setSummary(text: string): this {
    this.summaryText = text;
    return this;
  }

  public addCard(
    title: string,
    body: string,
    footer?: string,
    buttons?: NativeFlowButtonDef[] | ((b: NativeFlowBuilder) => NativeFlowBuilder)
  ): this {
    let resolvedButtons: NativeFlowButtonDef[] = [];
    if (typeof buttons === 'function') {
      const b = new NativeFlowBuilder();
      resolvedButtons = buttons(b).build();
    } else if (Array.isArray(buttons)) {
      resolvedButtons = buttons;
    }

    this.cards.push({
      header: { title },
      body: { text: body },
      footer: footer ? { text: footer } : undefined,
      buttons: resolvedButtons
    });
    return this;
  }

  public addCardWithOptions(card: CarouselCardOptions): this {
    this.cards.push(card);
    return this;
  }

  public build(): proto.IMessage {
    if (this.cards.length === 0) {
      throw new ValidationError('Carousel must contain at least one card', 'cards');
    }

    return InteractiveBuilder.fromOptions({
      body: this.summaryText || 'Explore options below:',
      carouselCards: this.cards
    });
  }
}
