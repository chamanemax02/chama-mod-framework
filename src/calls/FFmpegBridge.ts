import { spawn, type ChildProcess } from 'child_process';
import fs from 'fs';
import { EventEmitter } from 'events';
import type { VideoStreamOptions } from '../types/calls.js';
import { ChamaError } from '../core/Errors.js';

export class FFmpegBridge extends EventEmitter {
  private process: ChildProcess | null = null;
  private isRunning = false;

  constructor(private readonly options: VideoStreamOptions) {
    super();
  }

  /**
   * Check if FFmpeg is installed and executable
   */
  public static async isFFmpegAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const cp = spawn('ffmpeg', ['-version']);
        cp.on('error', () => resolve(false));
        cp.on('close', (code) => resolve(code === 0));
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Start transcoding the video file in real-time
   */
  public async start(): Promise<void> {
    if (!fs.existsSync(this.options.videoPath)) {
      throw new ChamaError(`Video file not found at path: ${this.options.videoPath}`, 'FILE_NOT_FOUND');
    }

    const available = await FFmpegBridge.isFFmpegAvailable();
    if (!available) {
      throw new ChamaError(
        'FFmpeg is not installed or not available in system PATH. Please install FFmpeg to enable real-time video call streaming.',
        'FFMPEG_NOT_FOUND'
      );
    }

    const width = this.options.width || 640;
    const height = this.options.height || 480;
    const fps = this.options.fps || 30;
    const bitrate = this.options.bitrate || '500k';

    // FFmpeg args for real-time VP8 video encoding
    const args: string[] = [
      '-re', // Read input at native frame rate
      '-i', this.options.videoPath,
      '-an', // Video only in this pipeline
      '-c:v', 'libvpx',
      '-pix_fmt', 'yuv420p',
      '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
      '-r', String(fps),
      '-g', String(fps), // 1 keyframe per second
      '-b:v', bitrate,
      '-maxrate', bitrate,
      '-bufsize', '1000k',
      '-deadline', 'realtime',
      '-cpu-used', '4',
      '-f', 'rawvideo',
      'pipe:1'
    ];

    if (this.options.loop) {
      args.unshift('-stream_loop', '-1');
    }

    this.process = spawn('ffmpeg', args, {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    this.isRunning = true;

    this.process.stdout?.on('data', (chunk: Buffer) => {
      this.emit('video_data', chunk);
    });

    this.process.stderr?.on('data', (data: Buffer) => {
      // Diagnostic output
      const log = data.toString();
      if (log.includes('error') || log.includes('Error')) {
        this.emit('log_error', log);
      }
    });

    this.process.on('close', (code) => {
      this.isRunning = false;
      this.emit('end', code);
    });

    this.process.on('error', (err) => {
      this.isRunning = false;
      this.emit('error', err);
    });
  }

  /**
   * Stop the transcoding process
   */
  public stop(): void {
    if (this.process && this.isRunning) {
      this.process.kill('SIGKILL');
      this.process = null;
      this.isRunning = false;
    }
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}
