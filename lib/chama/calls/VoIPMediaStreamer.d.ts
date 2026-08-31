import type { WASocket } from '../../index.js';
import type { VideoStreamOptions, VideoStreamSession } from '../types/calls.js';
export declare class VoIPMediaStreamer {
    private readonly sock;
    private readonly signaling;
    private activeSession;
    private ffmpeg;
    private udpSocket;
    private rtpPacketizer;
    private streamTimer;
    private elapsedSeconds;
    constructor(sock: WASocket);
    /**
     * Initiate an actual video call and stream a video file in real-time
     */
    streamVideoCall(toJid: string, options: VideoStreamOptions): Promise<VideoStreamSession>;
    /**
     * Start FFmpeg real-time transcode & UDP packet broadcaster
     */
    private startMediaTransmission;
    /**
     * Send packet to media transport
     */
    private emitRtpPacket;
    /**
     * Stop active streaming session
     */
    stopStream(toJid?: string, callId?: string): Promise<void>;
}
//# sourceMappingURL=VoIPMediaStreamer.d.ts.map