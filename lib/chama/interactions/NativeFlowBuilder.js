import { ValidationError } from '../core/Errors.js';
/**
 * Fluent builder for WhatsApp Native Flow Buttons
 */
export class NativeFlowBuilder {
    buttons = [];
    /**
     * Add a Quick Reply button
     */
    addQuickReply(displayText, id) {
        if (!displayText || !id) {
            throw new ValidationError('QuickReply requires displayText and id', 'quick_reply');
        }
        const params = {
            display_text: displayText,
            id
        };
        this.buttons.push({
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify(params)
        });
        return this;
    }
    /**
     * Add a Call-to-Action URL button (opens website / webapp)
     */
    addUrl(displayText, url, merchantUrl) {
        if (!displayText || !url) {
            throw new ValidationError('CTA URL requires displayText and url', 'cta_url');
        }
        const params = {
            display_text: displayText,
            url,
            merchant_url: merchantUrl || url
        };
        this.buttons.push({
            name: 'cta_url',
            buttonParamsJson: JSON.stringify(params)
        });
        return this;
    }
    /**
     * Add a Call-to-Action Phone button (initiates phone call)
     */
    addCall(displayText, phoneNumber) {
        if (!displayText || !phoneNumber) {
            throw new ValidationError('CTA Call requires displayText and phoneNumber', 'cta_call');
        }
        const params = {
            display_text: displayText,
            phone_number: phoneNumber
        };
        this.buttons.push({
            name: 'cta_call',
            buttonParamsJson: JSON.stringify(params)
        });
        return this;
    }
    /**
     * Add a Copy Code button
     */
    addCopyCode(displayText, copyCode, id) {
        if (!displayText || !copyCode) {
            throw new ValidationError('CTA Copy requires displayText and copyCode', 'cta_copy');
        }
        const params = {
            display_text: displayText,
            copy_code: copyCode,
            id: id || `copy_${Date.now()}`
        };
        this.buttons.push({
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify(params)
        });
        return this;
    }
    /**
     * Add a Single Select / List Menu
     */
    addSingleSelect(title, sections) {
        if (!title || !sections || sections.length === 0) {
            throw new ValidationError('Single Select requires title and at least one section', 'single_select');
        }
        const params = {
            title,
            sections
        };
        this.buttons.push({
            name: 'single_select',
            buttonParamsJson: JSON.stringify(params)
        });
        return this;
    }
    /**
     * Add a custom or generic native flow button
     */
    addCustom(name, params) {
        if (!name) {
            throw new ValidationError('Custom button requires a name', 'custom_button');
        }
        this.buttons.push({
            name,
            buttonParamsJson: typeof params === 'string' ? params : JSON.stringify(params)
        });
        return this;
    }
    /**
     * Return built buttons array
     */
    build() {
        return [...this.buttons];
    }
}
//# sourceMappingURL=NativeFlowBuilder.js.map