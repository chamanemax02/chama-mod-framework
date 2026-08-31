import { CodeHighlightType } from '../Types/RichType.js';
export declare const LEXER_REGEX: RegExp;
export declare const tokenizeCode: (code: string, language?: string) => {
    highlightType: CodeHighlightType;
    codeContent: string | undefined;
}[];
export declare const toUnified: (submessages: any[]) => {
    response_id: `${string}-${string}-${string}-${string}-${string}`;
    sections: any[];
};
export declare const prepareRichResponseMessage: (content: any) => {
    messageContextInfo: {
        botMetadata: {
            verificationMetadata: {
                proofs: {
                    certificateChain: Uint8Array<ArrayBuffer>[];
                    version: number;
                    useCase: number;
                    signature: Uint8Array<ArrayBuffer>;
                }[];
            };
        };
    };
    botForwardedMessage: {
        message: {
            richResponseMessage: any;
        };
    };
};
export declare const botMetadataSignature: () => Uint8Array<ArrayBuffer>;
export declare const botMetadataCertificate: (length?: number) => Uint8Array<ArrayBuffer>;
export declare const wrapToBotForwardedMessage: (richResponseMessage: any) => {
    messageContextInfo: {
        botMetadata: {
            verificationMetadata: {
                proofs: {
                    certificateChain: Uint8Array<ArrayBuffer>[];
                    version: number;
                    useCase: number;
                    signature: Uint8Array<ArrayBuffer>;
                }[];
            };
        };
    };
    botForwardedMessage: {
        message: {
            richResponseMessage: any;
        };
    };
};
//# sourceMappingURL=rich-message-utils.d.ts.map