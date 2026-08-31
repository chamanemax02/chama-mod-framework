export function detectCapabilities() {
    return {
        version: {
            framework: '1.0.0',
            baileys: '7.0.0-rc14',
            targetVersion: '7.0.0-rc14'
        },
        features: {
            richResponse: true,
            interactiveMessages: true,
            nativeFlowButtons: true,
            carouselCards: true,
            quickReplies: true,
            singleSelectLists: true,
            callLinksVoice: true,
            callLinksVideo: true,
            incomingCallDetection: true,
            callRejection: true,
            outgoingCallSignaling: 'experimental',
            outgoingCallMediaStreaming: 'unsupported_without_webrtc_bridge',
            rawHtmlDomExecutionInChat: 'unsupported_by_whatsapp_protocol',
            interactiveGameEngine: true,
            openGraphRichCards: true,
            groupManagement: true,
            newsletterManagement: true,
            eventMessages: true,
            albumMessages: true,
            pinMessages: true,
            editMessages: true,
            pollMessages: true,
            pluginSystem: true
        },
        supportedNativeFlows: [
            'quick_reply',
            'cta_url',
            'cta_call',
            'cta_copy',
            'single_select',
            'cta_reminder',
            'review_and_pay'
        ],
        unsupportedNotes: [
            'Raw HTML/JS/CSS DOM rendering inside WhatsApp chat bubble is not supported by WhatsApp protocol; use sendRichHTMLCard, sendGameLaunchCard or GameSession instead.',
            'VoIP RTP media transport for outgoing calls requires an external WebRTC media bridge server; signaling offers can be dispatched experimentally.'
        ]
    };
}
//# sourceMappingURL=Capabilities.js.map