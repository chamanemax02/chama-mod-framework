import type { WACallEvent, WACallUpdateType } from '../../index.js';
export type CallMediaType = 'audio' | 'video';
export interface CallLinkOptions {
    type: CallMediaType;
    event?: {
        startTime: number;
    };
    timeoutMs?: number;
}
export interface CallLinkResult {
    token: string;
    type: CallMediaType;
    url: string;
    startTime?: number;
}
export interface OutgoingCallOfferOptions {
    toJid: string;
    type: CallMediaType;
    isGroup?: boolean;
    groupJid?: string;
    callId?: string;
}
export interface CallHandlerContext {
    call: WACallEvent;
    isIncoming: boolean;
    isOffer: boolean;
    isVideo: boolean;
    isGroup: boolean;
    callerJid: string;
    callerPn?: string;
    callId: string;
    status: WACallUpdateType;
    date: Date;
    reject: () => Promise<void>;
}
export type CallEventListener = (ctx: CallHandlerContext) => void | Promise<void>;
/**
 * VoIP Video Stream Configuration
 */
export interface VideoStreamOptions {
    /**
     * Path to the video file to stream (e.g. './assets/video.mp4')
     */
    videoPath: string;
    /**
     * Optional custom audio track path (if not provided, extracted from video)
     */
    audioPath?: string;
    /**
     * Whether to loop the video if call duration exceeds video duration
     */
    loop?: boolean;
    /**
     * Target video resolution width (default: 640)
     */
    width?: number;
    /**
     * Target video resolution height (default: 480)
     */
    height?: number;
    /**
     * Target frame rate FPS (default: 30)
     */
    fps?: number;
    /**
     * Target video bitrate (default: '500k')
     */
    bitrate?: string;
    /**
     * Callback fired when callee answers and video stream starts
     */
    onConnected?: () => void;
    /**
     * Callback fired on streaming progress (seconds elapsed)
     */
    onProgress?: (seconds: number) => void;
    /**
     * Callback fired when call terminates
     */
    onTerminated?: (reason?: string) => void;
    /**
     * Callback fired on any error
     */
    onError?: (error: Error) => void;
}
export interface VideoStreamSession {
    callId: string;
    toJid: string;
    videoPath: string;
    status: 'initiating' | 'ringing' | 'streaming' | 'terminated' | 'failed';
    stop: () => Promise<void>;
}
//# sourceMappingURL=calls.d.ts.map