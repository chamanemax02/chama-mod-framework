import type { ListSectionItem, NativeFlowButtonDef } from '../types/interactive.js';
/**
 * Fluent builder for WhatsApp Native Flow Buttons
 */
export declare class NativeFlowBuilder {
    private readonly buttons;
    /**
     * Add a Quick Reply button
     */
    addQuickReply(displayText: string, id: string): this;
    /**
     * Add a Call-to-Action URL button (opens website / webapp)
     */
    addUrl(displayText: string, url: string, merchantUrl?: string): this;
    /**
     * Add a Call-to-Action Phone button (initiates phone call)
     */
    addCall(displayText: string, phoneNumber: string): this;
    /**
     * Add a Copy Code button
     */
    addCopyCode(displayText: string, copyCode: string, id?: string): this;
    /**
     * Add a Single Select / List Menu
     */
    addSingleSelect(title: string, sections: ListSectionItem[]): this;
    /**
     * Add a custom or generic native flow button
     */
    addCustom(name: string, params: Record<string, unknown> | string): this;
    /**
     * Return built buttons array
     */
    build(): NativeFlowButtonDef[];
}
//# sourceMappingURL=NativeFlowBuilder.d.ts.map