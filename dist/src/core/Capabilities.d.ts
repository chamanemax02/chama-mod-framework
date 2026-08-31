export interface FrameworkCapabilities {
    version: {
        framework: string;
        baileys: string;
        targetVersion: string;
    };
    features: {
        richResponse: boolean;
        interactiveMessages: boolean;
        nativeFlowButtons: boolean;
        carouselCards: boolean;
        quickReplies: boolean;
        singleSelectLists: boolean;
        callLinksVoice: boolean;
        callLinksVideo: boolean;
        incomingCallDetection: boolean;
        callRejection: boolean;
        outgoingCallSignaling: 'experimental';
        outgoingCallMediaStreaming: 'unsupported_without_webrtc_bridge';
        rawHtmlDomExecutionInChat: 'unsupported_by_whatsapp_protocol';
        interactiveGameEngine: boolean;
        openGraphRichCards: boolean;
        groupManagement: boolean;
        newsletterManagement: boolean;
        eventMessages: boolean;
        albumMessages: boolean;
        pinMessages: boolean;
        editMessages: boolean;
        pollMessages: boolean;
        pluginSystem: boolean;
    };
    supportedNativeFlows: string[];
    unsupportedNotes: string[];
}
export declare function detectCapabilities(): FrameworkCapabilities;
//# sourceMappingURL=Capabilities.d.ts.map