import type { WASocket } from '@whiskeysockets/baileys';
import type { OutgoingCallOfferOptions } from '../types/calls.js';
export declare class CallSignalingManager {
    private readonly sock;
    constructor(sock: WASocket);
    /**
     * Reject an incoming call via WhatsApp protocol
     */
    rejectCall(callId: string, callFrom: string): Promise<void>;
    /**
     * Send an outgoing call offer signaling stanza (EXPERIMENTAL)
     *
     * @note Signaling initiates the call session on WhatsApp servers. Full bidirectional
     * real-time voice/video media streaming (WebRTC / SRTP) requires an external VoIP media gateway.
     */
    sendCallOfferSignaling(options: OutgoingCallOfferOptions): Promise<{
        callId: string;
        status: string;
    }>;
    /**
     * Terminate a call session signaling stanza
     */
    sendCallTerminateSignaling(toJid: string, callId: string): Promise<void>;
    /**
     * Attempting raw media stream injection without WebRTC bridge throws clear diagnostic error
     */
    streamVoipMedia(): never;
}
//# sourceMappingURL=CallSignaling.d.ts.map