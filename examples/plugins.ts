import makeChamaSocket, {
  useMultiFileAuthState,
  antiCallPlugin,
  autoReadPlugin,
  commandRouterPlugin,
  type ChamaPlugin
} from '../src/index.js';
import pino from 'pino';

// Custom developer plugin
const customGreetingPlugin: ChamaPlugin = {
  name: 'custom-greeting',
  version: '1.0.0',
  description: 'Greets users on first message',
  init: (chama) => {
    chama.onMessage(async (ctx) => {
      if (ctx.text === '!hello') {
        await ctx.reply(`👋 Hello! CHAMA MOD Plugin System is active.`);
      }
    });
  }
};

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = makeChamaSocket({
    auth: state,
    logger: pino({ level: 'silent' })
  });

  sock.raw.ev.on('creds.update', saveCreds);

  // Load plugins dynamically
  await sock.use(antiCallPlugin({ message: 'Calls are disabled on this number.' }));
  await sock.use(autoReadPlugin());
  await sock.use(customGreetingPlugin);

  // Command router plugin
  await sock.use(
    commandRouterPlugin({
      prefix: '#',
      commands: {
        ping: async (ctx) => {
          await ctx.reply('Pong! (Routed via CommandRouterPlugin)');
        },
        info: async (ctx) => {
          await ctx.reply(`Active plugins:\n- ${sock.plugins.list().join('\n- ')}`);
        }
      }
    })
  );

  console.log('Loaded plugins:', sock.plugins.list());
}

main().catch(console.error);
