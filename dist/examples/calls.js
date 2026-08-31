import makeChamaSocket, { useMultiFileAuthState } from '../src/index.js';
import pino from 'pino';
async function main() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeChamaSocket({
        auth: state,
        logger: pino({ level: 'info' })
    });
    sock.raw.ev.on('creds.update', saveCreds);
    // 1. Listen to incoming calls
    sock.onCall(async (ctx) => {
        console.log(`[Incoming Call Detected]`);
        console.log(`- Caller: ${ctx.callerJid}`);
        console.log(`- Type: ${ctx.isVideo ? 'Video' : 'Voice'} Call`);
        console.log(`- Call ID: ${ctx.callId}`);
        console.log(`- Status: ${ctx.status}`);
        if (ctx.isIncoming) {
            // Reject call and send automated text notification
            await ctx.reject();
            console.log(`Successfully rejected call from ${ctx.callerJid}`);
            await sock.sendText(ctx.callerJid, `📵 *Automated Call Notice*\nHello! Calls are not accepted on this automated WhatsApp number. Please send a text message instead.`);
        }
    });
    // 2. You can also turn on auto-reject globally with custom text:
    // sock.calls.setAutoReject(true, 'This bot does not accept voice or video calls.');
}
main().catch(console.error);
//# sourceMappingURL=calls.js.map