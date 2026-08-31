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
    // 1. Group info
    if (ctx.text === '!group-info' && ctx.isGroup) {
      const meta = await sock.groups.getMetadata(ctx.chatId);
      await ctx.reply(
        `👥 *Group Details*\n- Subject: *${meta.subject}*\n- Owner: *${meta.owner || 'None'}*\n- Participants: *${meta.participants.length}*`
      );
    }

    // 2. Create WhatsApp Event
    if (ctx.text === '!create-event') {
      await sock.sendEvent(ctx.chatId, {
        name: '🚀 CHAMA Framework Launch Event',
        description: 'Live demonstration of WhatsApp Native Flow buttons & Baileys v7 Mod Layer.',
        startTime: new Date(Date.now() + 3600 * 1000 * 24), // Tomorrow
        endTime: new Date(Date.now() + 3600 * 1000 * 26),
        location: { name: 'Virtual Conference Room' }
      });
    }

    // 3. Create Newsletter / Channel
    if (ctx.text === '!create-channel') {
      const channel = await sock.newsletters.create(
        'CHAMA Updates Channel',
        'Official updates and releases from CHAMA Dev'
      );
      await ctx.reply(`📢 *Channel Created!*\n- Name: ${channel.name}\n- JID: ${channel.id}`);
    }
  });
}

main().catch(console.error);
