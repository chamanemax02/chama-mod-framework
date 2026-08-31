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
    if (ctx.text === '!rich') {
      await sock.sendRichResponse(ctx.chatId, {
        title: '🌟 CHAMA Premium Service 🌟',
        subtitle: 'Advanced Baileys v7 Mod Layer',
        body: `Hello @${ctx.senderJid.split('@')[0]}!\n\nWelcome to *CHAMA MOD Framework*.\nWe provide enterprise-grade WhatsApp solutions with high reliability and full protocol compliance.`,
        footer: 'CHAMA Dev • Powered by Baileys v7',
        buttons: [
          {
            name: 'quick_reply',
            buttonParamsJson: { display_text: '📦 View Products', id: 'cmd_products' }
          },
          {
            name: 'cta_url',
            buttonParamsJson: { display_text: '🌐 Visit Website', url: 'https://github.com' }
          },
          {
            name: 'cta_copy',
            buttonParamsJson: { display_text: '🎟️ Copy Promo Code', copy_code: 'CHAMA2026' }
          }
        ],
        quoted: ctx.message
      });
    }
  });
}

main().catch(console.error);
