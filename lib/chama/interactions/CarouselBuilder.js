import { ValidationError } from '../core/Errors.js';
import { InteractiveBuilder } from './InteractiveBuilder.js';
import { NativeFlowBuilder } from './NativeFlowBuilder.js';
/**
 * Fluent builder for multi-card Carousel Messages
 */
export class CarouselBuilder {
    summaryText = '';
    cards = [];
    setSummary(text) {
        this.summaryText = text;
        return this;
    }
    addCard(title, body, footer, buttons) {
        let resolvedButtons = [];
        if (typeof buttons === 'function') {
            const b = new NativeFlowBuilder();
            resolvedButtons = buttons(b).build();
        }
        else if (Array.isArray(buttons)) {
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
    addCardWithOptions(card) {
        this.cards.push(card);
        return this;
    }
    build() {
        if (this.cards.length === 0) {
            throw new ValidationError('Carousel must contain at least one card', 'cards');
        }
        return InteractiveBuilder.fromOptions({
            body: this.summaryText || 'Explore options below:',
            carouselCards: this.cards
        });
    }
}
//# sourceMappingURL=CarouselBuilder.js.map