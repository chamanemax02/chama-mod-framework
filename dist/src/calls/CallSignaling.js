import { UnsupportedFeatureError } from '../core/Errors.js';
export class CallSignalingManager {
    sock;
    constructor(sock) {
        this.sock = sock;
    }
    /**
     * Reject an incoming call via WhatsApp protocol
     */
    async rejectCall(callId, callFrom) {
        await this.sock.rejectCall(callId, callFrom);
    }
    /**
     * Send an outgoing call offer signaling stanza (EXPERIMENTAL)
     *
     * @note Signaling initiates the call session on WhatsApp servers. Full bidirectional
     * real-time voice/video media streaming (WebRTC / SRTP) requires an external VoIP media gateway.
     */
    async sendCallOfferSignaling(options) {
        const callId = options.callId || `call_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const meJid = this.sock.authState.creds?.me?.id;
        const offerContent = [
            {
                tag: 'audio',
                attrs: { enc: 'opus', rate: '16000' },
                content: undefined
            }
        ];
        if (options.type === 'video') {
            offerContent.push({
                tag: 'video',
                attrs: { enc: 'vp8', orientation: '0', screen_width: '640', screen_height: '480' },
                content: undefined
            });
        }
        const stanza = {
            tag: 'call',
            attrs: {
                to: options.toJid,
                id: this.sock.generateMessageTag()
            },
            content: [
                {
                    tag: 'offer',
                    attrs: {
                        'call-id': callId,
                        'call-creator': meJid || ''
                    },
                    content: offerContent
                }
            ]
        };
        await this.sock.sendNode(stanza);
        return {
            callId,
            status: 'signaling_offer_sent'
        };
    }
    /**
     * Terminate a call session signaling stanza
     */
    async sendCallTerminateSignaling(toJid, callId) {
        const meJid = this.sock.authState.creds?.me?.id;
        const stanza = {
            tag: 'call',
            attrs: {
                to: toJid,
                id: this.sock.generateMessageTag()
            },
            content: [
                {
                    tag: 'terminate',
                    attrs: {
                        'call-id': callId,
                        'call-creator': meJid || '',
                        reason: 'hangup'
                    },
                    content: undefined
                }
            ]
        };
        await this.sock.sendNode(stanza);
    }
    /**
     * Attempting raw media stream injection without WebRTC bridge throws clear diagnostic error
     */
    streamVoipMedia() {
        throw new UnsupportedFeatureError('voip-media-transport', 'Raw audio/video RTP streaming in Node.js requires an external WebRTC/SRTP media server bridge. Use createVoiceCallLink() or createVideoCallLink() for seamless call initiation.');
    }
}
//# sourceMappingURL=CallSignaling.js.map