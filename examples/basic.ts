import makeChamaSocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers
} from '../src/index.js';
import pino from 'pino';
import { Boom } from '@hapi/boom';

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');

  const sock = makeChamaSocket({
    auth: state,
    logger: pino({ level: 'info' }),
    printQRInTerminal: true,
    browser: Browsers.ubuntu('Chrome')
  });

  // Creds update
  sock.raw.ev.on('creds.update', saveCreds);

  // Connection listener
  sock.onConnectionUpdate((update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('Scan the QR code printed in terminal or use pairing code.');
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        main();
      }
    } else if (connection === 'open') {
      console.log('🎉 CHAMA MOD Framework connected successfully!');
      console.log('Capabilities:', JSON.stringify(sock.features(), null, 2));
    }
  });

  // Message listener
  sock.onMessage(async (ctx) => {
    console.log(`[Message from ${ctx.senderJid}]: ${ctx.text}`);

    if (ctx.text === '!ping') {
      await ctx.reply('🏓 Pong from CHAMA MOD Framework!');
    }
  });
}

main().catch(console.error);
