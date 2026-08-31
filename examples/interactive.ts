import makeChamaSocket, { useMultiFileAuthState, NativeFlowBuilder } from '../src/index.js';
import pino from 'pino';

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = makeChamaSocket({
    auth: state,
    logger: pino({ level: 'silent' })
  });

  sock.raw.ev.on('creds.update', saveCreds);

  sock.onMessage(async (ctx) => {
    if (ctx.text === '!interactive') {
      // 1. Send Interactive Single Select Menu
      await sock.sendInteractive(ctx.chatId, {
        header: { title: 'CHAMA NAVIGATION MENU' },
        body: 'Please choose an option from the menu below:',
        footer: 'CHAMA Interactive Layer',
        buttons: (new NativeFlowBuilder())
          .addSingleSelect('📋 Open Main Menu', [
            {
              title: '🔥 Popular Features',
              rows: [
                { id: 'opt_rich', title: '🌟 Rich Response', description: 'Experience rich cards & UI' },
                { id: 'opt_games', title: '🎮 Play Games', description: 'Interactive WhatsApp games' },
                { id: 'opt_calls', title: '📞 Call Links', description: 'Create voice & video links' }
              ]
            },
            {
              title: '⚙️ Utilities',
              rows: [
                { id: 'opt_poll', title: '📊 Create Poll', description: 'Interactive poll demo' },
                { id: 'opt_event', title: '📅 Schedule Event', description: 'WhatsApp event demo' }
              ]
            }
          ])
          .addUrl('🌐 Documentation', 'https://github.com')
          .build()
      });
    }

    if (ctx.text === '!carousel') {
      // 2. Send Multi-card Carousel
      await sock.sendCarousel(ctx.chatId, 'Check out our services:', [
        {
          header: '💎 Service Tier 1',
          body: 'Standard WhatsApp Bot with basic auto-reply and contact management.',
          buttons: [
            { name: 'quick_reply', buttonParamsJson: { display_text: 'Select Tier 1', id: 'tier_1' } }
          ]
        },
        {
          header: '🚀 Service Tier 2',
          body: 'Advanced Bot with Rich Interactive Buttons, Games, and Call Link generator.',
          buttons: [
            { name: 'quick_reply', buttonParamsJson: { display_text: 'Select Tier 2', id: 'tier_2' } }
          ]
        },
        {
          header: '👑 Enterprise Suite',
          body: 'Full Custom Mod Layer with Anti-call, Webhooks, and Newsletter automation.',
          buttons: [
            { name: 'quick_reply', buttonParamsJson: { display_text: 'Select Enterprise', id: 'tier_ent' } }
          ]
        }
      ]);
    }
  });
}

main().catch(console.error);
