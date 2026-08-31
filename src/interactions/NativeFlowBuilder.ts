import type {
  CtaCallButtonParams,
  CtaCopyButtonParams,
  CtaUrlButtonParams,
  ListSectionItem,
  NativeFlowButtonDef,
  QuickReplyButtonParams,
  SingleSelectButtonParams
} from '../types/interactive.js';
import { ValidationError } from '../core/Errors.js';

/**
 * Fluent builder for WhatsApp Native Flow Buttons
 */
export class NativeFlowBuilder {
  private readonly buttons: NativeFlowButtonDef[] = [];

  /**
   * Add a Quick Reply button
   */
  public addQuickReply(displayText: string, id: string): this {
    if (!displayText || !id) {
      throw new ValidationError('QuickReply requires displayText and id', 'quick_reply');
    }
    const params: QuickReplyButtonParams = {
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
  public addUrl(displayText: string, url: string, merchantUrl?: string): this {
    if (!displayText || !url) {
      throw new ValidationError('CTA URL requires displayText and url', 'cta_url');
    }
    const params: CtaUrlButtonParams = {
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
  public addCall(displayText: string, phoneNumber: string): this {
    if (!displayText || !phoneNumber) {
      throw new ValidationError('CTA Call requires displayText and phoneNumber', 'cta_call');
    }
    const params: CtaCallButtonParams = {
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
  public addCopyCode(displayText: string, copyCode: string, id?: string): this {
    if (!displayText || !copyCode) {
      throw new ValidationError('CTA Copy requires displayText and copyCode', 'cta_copy');
    }
    const params: CtaCopyButtonParams = {
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
  public addSingleSelect(title: string, sections: ListSectionItem[]): this {
    if (!title || !sections || sections.length === 0) {
      throw new ValidationError('Single Select requires title and at least one section', 'single_select');
    }
    const params: SingleSelectButtonParams = {
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
  public addCustom(name: string, params: Record<string, unknown> | string): this {
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
  public build(): NativeFlowButtonDef[] {
    return [...this.buttons];
  }
}
