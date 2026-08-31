import makeChamaSocket, { useMultiFileAuthState } from '../src/index.js';
import pino from 'pino';
async function main() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeChamaSocket({
        auth: state,
        logger: pino({ level: 'silent' })
    });
    sock.raw.ev.on('creds.update', saveCreds);
    sock.onMessage(async (ctx) => {
        // Generate Voice Call Link
        if (ctx.text === '!voice-link') {
            const link = await sock.createVoiceCallLink();
            await sock.sendRichResponse(ctx.chatId, {
                title: '📞 WhatsApp Voice Call Link',
                body: `Your official voice call link has been generated:\n\n${link.url}`,
                buttons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: { display_text: 'Join Voice Call 📞', url: link.url }
                    }
                ]
            });
        }
        // Generate Video Call Link
        if (ctx.text === '!video-link') {
            const link = await sock.createVideoCallLink();
            await sock.sendRichResponse(ctx.chatId, {
                title: '📹 WhatsApp Video Call Link',
                body: `Your official video conference link has been generated:\n\n${link.url}`,
                buttons: [
                    {
                        name: 'cta_url',
                        buttonParamsJson: { display_text: 'Join Video Call 📹', url: link.url }
                    }
                ]
            });
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=call-link.js.map