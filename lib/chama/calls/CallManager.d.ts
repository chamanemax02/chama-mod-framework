import type { WASocket } from '@whiskeysockets/baileys';
import type { CallEventListener, CallLinkOptions, CallLinkResult, VideoStreamOptions, VideoStreamSession } from '../types/calls.js';
export declare class CallManager {
    private readonly sock;
    private readonly callLinks;
    private readonly signaling;
    private readonly streamer;
    private readonly callListeners;
    private autoRejectEnabled;
    private autoRejectReason;
    constructor(sock: WASocket);
    private setupCallEventListener;
    /**
     * Listen to incoming and call update events
     */
    onCall(listener: CallEventListener): () => void;
    /**
     * Enable or disable automatic incoming call rejection
     */
    setAutoReject(enabled: boolean, responseMessage?: string): this;
    /**
     * Reject an incoming call
     */
    rejectCall(callId: string, fromJid: string): Promise<void>;
    /**
     * Create a Voice Call Link
     */
    createVoiceCallLink(event?: {
        startTime: number;
    }, timeoutMs?: number): Promise<CallLinkResult>;
    /**
     * Create a Video Call Link
     */
    createVideoCallLink(event?: {
        startTime: number;
    }, timeoutMs?: number): Promise<CallLinkResult>;
    /**
     * Create a Call Link (audio or video)
     */
    createCallLink(options: CallLinkOptions): Promise<CallLinkResult>;
    /**
     * Send experimental outgoing call signaling offer
     */
    call(toJid: string, options: {
        type: 'audio' | 'video';
    }): Promise<{
        callId: string;
        status: string;
    }>;
    /**
     * Terminate call signaling
     */
    terminateCall(toJid: string, callId: string): Promise<void>;
    /**
     * Start a real-time Video Call Streaming Session playing a video file
     */
    streamVideoCall(toJid: string, options: VideoStreamOptions): Promise<VideoStreamSession>;
    /**
     * Stop any active video stream
     */
    stopVideoStream(): Promise<void>;
}
//# sourceMappingURL=CallManager.d.ts.map