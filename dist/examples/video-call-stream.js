import makeChamaSocket, { useMultiFileAuthState } from '../src/index.js';
import pino from 'pino';
import path from 'path';
async function main() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeChamaSocket({
        auth: state,
        logger: pino({ level: 'info' })
    });
    sock.raw.ev.on('creds.update', saveCreds);
    sock.onMessage(async (ctx) => {
        // Trigger real video call stream with !call-video
        if (ctx.text === '!call-video') {
            await ctx.reply('📹 Initiating WhatsApp Video Call with video stream...');
            try {
                const videoPath = path.resolve('./assets/sample.mp4');
                const session = await sock.streamVideoCall(ctx.senderJid, {
                    videoPath,
                    loop: true,
                    width: 640,
                    height: 480,
                    fps: 30,
                    bitrate: '500k',
                    onConnected: () => {
                        console.log('🎉 Callee answered! Live video stream is playing in video call.');
                    },
                    onProgress: (seconds) => {
                        console.log(`⏱️ Video Call Stream active: ${seconds}s elapsed`);
                    },
                    onTerminated: (reason) => {
                        console.log(`📴 Video Call ended. Reason: ${reason}`);
                    },
                    onError: (err) => {
                        console.error('❌ Video Call stream error:', err);
                    }
                });
                console.log(`Video call session initiated: ${session.callId}`);
            }
            catch (err) {
                console.error('Failed to start video call stream:', err);
                await ctx.reply(`❌ Video call error: ${err.message}`);
            }
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=video-call-stream.js.map