declare const VERSION = "6.2.1";
declare class Toolkit {
    static extractIE(text: string, { extract, hyperlink, citation, latex }?: any): {
        text: string;
        ie: any[];
        inline_entities: any[];
    };
    static resize(buffer: any, x: number, y: number, fit?: string): Promise<any>;
    static waitAllPromises(input: any): Promise<any>;
    static fetchBuffer(url: string, options?: any, { silent }?: any): Promise<Buffer<ArrayBuffer>>;
    static toUrl(_client: any, path: any, mediaType?: string): Promise<any>;
    static resolveMedia(_client: any, media: any, mediaType?: string, { resolveUrl, resolveWAUrl, result, resize, width, height }?: any): Promise<any>;
    static getMp4Duration(buffer: any, { silent }?: any): number;
    static getMp4Preview(videoBuffer: any, { time, result, resize, width, height, silent }?: any): Promise<any>;
    static stringifyEscaped(obj: any): string;
}
declare class BaseBuilder {
    _title: string;
    _subtitle: string;
    _body: string;
    _footer: string;
    _contextInfo: any;
    _extraPayload: any;
    constructor();
    setTitle(title: string): this;
    setSubtitle(subtitle: string): this;
    setBody(body: string): this;
    setFooter(footer: string): this;
    setContextInfo(obj: any): this;
    addPayload(obj: any): this;
}
declare class Button extends BaseBuilder {
    #private;
    _buttons: any[];
    _data: any;
    _currentSelectionIndex: number;
    _currentSectionIndex: number;
    _params: any;
    constructor(client: any);
    loadFrom(msg: any): this;
    setImage(path: any, options?: any): this;
    setDocument(path: any, options?: any): this;
    setMedia(obj: any): this;
    clearButtons(): this;
    setParams(obj: any): this;
    addButton(name: string, params: any): this;
    makeRow(header?: string, title?: string, description?: string, id?: string): this;
    makeSection(title?: string, highlight_label?: string): this;
    addSelection(title: string, options?: any): this;
    addReply(display_text?: string, id?: string, options?: any): this;
    addCall(display_text?: string, id?: string, options?: any): this;
    addReminder(display_text?: string, id?: string, options?: any): this;
    addCancelReminder(display_text?: string, id?: string, options?: any): this;
    addAddress(display_text?: string, id?: string, options?: any): this;
    addLocation(options?: any): this;
    addUrl(display_text?: string, url?: string, webview_interaction?: boolean, options?: any): this;
    addCopy(display_text?: string, copy_code?: string, options?: any): this;
    static paramsList: {
        limited_time_offer: {
            text: string;
            url: string;
            copy_code: string;
            expiration_time: string;
        };
        bottom_sheet: {
            in_thread_buttons_limit: string;
            divider_indices: string[];
            list_title: string;
            button_title: string;
        };
        tap_target_configuration: {
            title: string;
            description: string;
            canonical_url: string;
            domain: string;
            buttonIndex: string;
        };
    };
    toCard(): Promise<{
        body: {
            text: string;
        };
        footer: {
            text: string;
        };
        header: any;
        nativeFlowMessage: {
            messageParamsJson: string;
            buttons: any[];
        };
    }>;
    build(jid: string, { messageId, ...options }?: any): Promise<import("../index.js").WAMessage>;
    send(jid: string, { messageId, additionalNodes, ...options }?: any): Promise<import("../index.js").WAMessage>;
}
declare class ButtonV2 extends BaseBuilder {
    #private;
    _image: any;
    _data: any;
    _buttons: any[];
    constructor(client: any);
    loadFrom(msg: any): this;
    addButton(displayText?: string, buttonId?: string): this;
    addRawButton(obj: any): this;
    setRawThumbnail(thumbnail: any): this;
    setThumbnail(path: any): this;
    setMedia(obj: any): this;
    build(jid: string, { messageId, ...options }?: any): Promise<import("../index.js").WAMessage>;
    send(jid: string, { messageId, additionalNodes, ...options }?: any): Promise<import("../index.js").WAMessage>;
}
declare class Carousel extends BaseBuilder {
    #private;
    _cards: any[];
    constructor(client: any);
    loadFrom(msg: any): this;
    addCard(card: any): this;
    build(jid: string, { messageId, ...options }?: any): import("../index.js").WAMessage;
    send(jid: string, { messageId, additionalNodes, ...options }?: any): Promise<import("../index.js").WAMessage>;
}
declare class AIRich extends BaseBuilder {
    #private;
    _nodes: any[];
    _idIndex: Map<string, any>;
    _unsupportedTypeAlert: boolean;
    _dynamic: boolean;
    _responseId: string;
    _botResponseId: string;
    _lastMessageKey: any;
    constructor(client: any, { dynamic, unsupportedTypeAlert }?: any);
    loadFrom(msg: any): this;
    setResponseId(id: string): this;
    refreshResponseId(): this;
    setBotResponseId(id: string): this;
    refreshBotResponseId(): this;
    createAlert(type: string): {
        messageType: number;
        messageText: string;
    } | undefined;
    addText(text: string, { hyperlink, citation, latex, id, replace, insertAt }?: any): this;
    addFOAText(text: string, { id, replace, insertAt }?: any): this;
    addCode(language: string, code: string, { id, replace, insertAt }?: any): this;
    addTable(table: any[], { hyperlink, citation, latex, id, replace, insertAt }?: any): this;
    addSource(sources?: any[], { id, replace, insertAt }?: any): this;
    addReels(reelsItems?: any, { id, replace, insertAt }?: any): this;
    addImage(imageUrl: any, { width, height, status, update_text, resolveUrl, id, replace, insertAt }?: any): this;
    addVideo(videoUrl: any, { autoFill, status, estimatedTime, id, replace, insertAt }?: any): this;
    addProduct(data?: any, { id, replace, insertAt }?: any): this;
    addPost(data?: any, { id, replace, insertAt }?: any): this;
    addMetadata(text: string, { id, replace, insertAt }?: any): this;
    addTip(text: string, { id, replace, insertAt }?: any): this;
    addWidget(data: any, { layout, id, replace, insertAt, ...options }?: any): this;
    addFooterAction(data: any, { layout, id, replace, insertAt, ...options }?: any): this;
    addSuggest(suggestion: any, { scroll, layout, id, replace, insertAt }?: any): this;
    _makeNode(id: string | null, section: any, submessage: any): {
        id: string | null;
        section: any;
        submessage: any;
    };
    _registerId(node: any, id: string): void;
    _unregisterId(node: any): void;
    hasId(id: string): boolean;
    getIds(): string[];
    peek(id: string): {
        id: any;
        section: any;
        submessage: any;
    } | null;
    assignId(index: number, id: string): this;
    _getNode(id: string): any;
    _resolveTarget(target: any): {
        id: string;
        offset: any;
    };
    _resolveNodeIndex(target: any): {
        id: string;
        offset: any;
        baseIndex: number;
        index: any;
    };
    _validateSections(section: any): any[];
    _validateSubmessages(submessage: any): any[];
    _addContent(section: any, submessage: any, { id, replace, insertAt }?: any): this;
    addSection(section: any, options?: any): this;
    addSubmessage(submessage: any, options?: any): this;
    delete(target: any): this;
    build(jid: string, { bypassDownload, forwarded, notification, includesUnifiedResponse, includesSubmessages, quoted, quotedParticipant, messageId, ...options }?: any): Promise<import("../index.js").WAMessage>;
    buildEdit(targetJid: string, targetId: string, { msg, messageId, ...options }?: any): Promise<import("../index.js").WAMessage>;
    sendEdit(jid?: string, id?: string, { msg, messageId, additionalNodes, ...options }?: any): Promise<import("../index.js").WAMessage>;
    send(jid: string, { bypassDownload, forwarded, notification, includesUnifiedResponse, includesSubmessages, messageId, additionalNodes, ...options }?: any): Promise<import("../index.js").WAMessage>;
    static tokenizer(code: string, lang?: string): {
        codeBlock: any[];
        unified_codeBlock: {
            content: any;
            type: string | undefined;
        }[];
    };
    static toTableMetadata(arr: any[][], { hyperlink, citation, latex }?: any): {
        title: string;
        rows: {
            isHeading?: boolean | undefined;
            items: any[];
        }[];
        unified_rows: {
            markdown_cells?: {
                inline_entities?: any[] | undefined;
                text: string;
            }[] | undefined;
            is_header: boolean;
            cells: any[];
        }[];
    };
    static newLayout(name: string, data: any, extra?: any): any;
    get _sections(): any[];
    get _submessages(): any[];
    get sections(): any[];
    get items(): any[];
}
export { VERSION, Button, ButtonV2, Carousel, AIRich, Toolkit };
//# sourceMappingURL=MessageBuilder.d.ts.map