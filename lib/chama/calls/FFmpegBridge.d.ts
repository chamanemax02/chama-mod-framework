import { EventEmitter } from 'events';
import type { VideoStreamOptions } from '../types/calls.js';
export declare class FFmpegBridge extends EventEmitter {
    private readonly options;
    private process;
    private isRunning;
    constructor(options: VideoStreamOptions);
    /**
     * Check if FFmpeg is installed and executable
     */
    static isFFmpegAvailable(): Promise<boolean>;
    /**
     * Start transcoding the video file in real-time
     */
    start(): Promise<void>;
    /**
     * Stop the transcoding process
     */
    stop(): void;
    getStatus(): boolean;
}
//# sourceMappingURL=FFmpegBridge.d.ts.map