import { CallLinksManager } from './CallLinks.js';
import { CallSignalingManager } from './CallSignaling.js';
import { VoIPMediaStreamer } from './VoIPMediaStreamer.js';
export class CallManager {
    sock;
    callLinks;
    signaling;
    streamer;
    callListeners = new Set();
    autoRejectEnabled = false;
    autoRejectReason = 'Calls are not accepted on this automated WhatsApp number.';
    constructor(sock) {
        this.sock = sock;
        this.callLinks = new CallLinksManager(sock);
        this.signaling = new CallSignalingManager(sock);
        this.streamer = new VoIPMediaStreamer(sock);
        this.setupCallEventListener();
    }
    setupCallEventListener() {
        this.sock.ev.on('call', async (calls) => {
            for (const call of calls) {
                const isIncoming = call.status === 'offer';
                const ctx = {
                    call,
                    isIncoming,
                    isOffer: isIncoming,
                    isVideo: !!call.isVideo,
                    isGroup: !!call.isGroup,
                    callerJid: call.from || call.chatId,
                    callerPn: call.callerPn,
                    callId: call.id,
                    status: call.status,
                    date: call.date,
                    reject: async () => {
                        await this.signaling.rejectCall(call.id, call.from || call.chatId);
                    }
                };
                // Auto-reject if enabled
                if (this.autoRejectEnabled && isIncoming) {
                    try {
                        await ctx.reject();
                        if (this.autoRejectReason) {
                            await this.sock.sendMessage(ctx.callerJid, {
                                text: `📵 ${this.autoRejectReason}`
                            });
                        }
                    }
                    catch (err) {
                        console.error('[CHAMA-MOD] Auto-reject failed:', err);
                    }
                }
                // Notify custom listeners
                for (const listener of this.callListeners) {
                    try {
                        await listener(ctx);
                    }
                    catch (err) {
                        console.error('[CHAMA-MOD] Call listener error:', err);
                    }
                }
            }
        });
    }
    /**
     * Listen to incoming and call update events
     */
    onCall(listener) {
        this.callListeners.add(listener);
        return () => {
            this.callListeners.delete(listener);
        };
    }
    /**
     * Enable or disable automatic incoming call rejection
     */
    setAutoReject(enabled, responseMessage) {
        this.autoRejectEnabled = enabled;
        if (responseMessage !== undefined) {
            this.autoRejectReason = responseMessage;
        }
        return this;
    }
    /**
     * Reject an incoming call
     */
    async rejectCall(callId, fromJid) {
        return await this.signaling.rejectCall(callId, fromJid);
    }
    /**
     * Create a Voice Call Link
     */
    async createVoiceCallLink(event, timeoutMs) {
        return await this.callLinks.createVoiceCallLink(event, timeoutMs);
    }
    /**
     * Create a Video Call Link
     */
    async createVideoCallLink(event, timeoutMs) {
        return await this.callLinks.createVideoCallLink(event, timeoutMs);
    }
    /**
     * Create a Call Link (audio or video)
     */
    async createCallLink(options) {
        return await this.callLinks.createCallLink(options);
    }
    /**
     * Send experimental outgoing call signaling offer
     */
    async call(toJid, options) {
        return await this.signaling.sendCallOfferSignaling({
            toJid,
            type: options.type
        });
    }
    /**
     * Terminate call signaling
     */
    async terminateCall(toJid, callId) {
        return await this.signaling.sendCallTerminateSignaling(toJid, callId);
    }
    /**
     * Start a real-time Video Call Streaming Session playing a video file
     */
    async streamVideoCall(toJid, options) {
        return await this.streamer.streamVideoCall(toJid, options);
    }
    /**
     * Stop any active video stream
     */
    async stopVideoStream() {
        await this.streamer.stopStream();
    }
}
//# sourceMappingURL=CallManager.js.map