import crypto from 'crypto';
import { jidNormalizedUser } from '../../WABinary/index.js';
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
     * Send an outgoing call offer signaling stanza (Calls user device and rings full-screen)
     */
    async sendCallOfferSignaling(options) {
        const callId = options.callId || crypto.randomBytes(16).toString('hex').toUpperCase();
        const meId = this.sock.user?.id || this.sock.authState.creds?.me?.id;
        const meJid = jidNormalizedUser(meId);
        const targetJid = jidNormalizedUser(options.toJid);

        const offerContent = [
            {
                tag: 'audio',
                attrs: { enc: 'opus', rate: '16000' },
                content: undefined
            }
        ];

        if (options.type === 'video' || !options.type) {
            offerContent.push({
                tag: 'video',
                attrs: { 
                    enc: 'vp8', 
                    orientation: '0', 
                    screen_width: '640', 
                    screen_height: '480',
                    fps: '30'
                },
                content: undefined
            });
        }

        offerContent.push(
            {
                tag: 'net',
                attrs: { medium: '3' },
                content: undefined
            },
            {
                tag: 'capability',
                attrs: { ver: '1' },
                content: new Uint8Array([1, 4, 255, 131, 207, 4])
            },
            {
                tag: 'encopt',
                attrs: { keygen: '2' },
                content: undefined
            }
        );

        const stanza = {
            tag: 'call',
            attrs: {
                to: targetJid,
                id: this.sock.generateMessageTag()
            },
            content: [
                {
                    tag: 'offer',
                    attrs: {
                        'call-id': callId,
                        'call-creator': meJid,
                        'device_class': '2015'
                    },
                    content: offerContent
                }
            ]
        };

        await this.sock.sendNode(stanza);
        console.log(`[CHAMA VoIP] Dispatched real WhatsApp call offer: ${callId} -> ${targetJid}`);

        return {
            callId,
            status: 'signaling_offer_sent'
        };
    }
    /**
     * Terminate a call session signaling stanza
     */
    async sendCallTerminateSignaling(toJid, callId) {
        const meId = this.sock.user?.id || this.sock.authState.creds?.me?.id;
        const meJid = jidNormalizedUser(meId);
        const targetJid = jidNormalizedUser(toJid);

        const stanza = {
            tag: 'call',
            attrs: {
                to: targetJid,
                id: this.sock.generateMessageTag()
            },
            content: [
                {
                    tag: 'terminate',
                    attrs: {
                        'call-id': callId,
                        'call-creator': meJid,
                        reason: 'hangup'
                    },
                    content: undefined
                }
            ]
        };
        await this.sock.sendNode(stanza);
    }
}