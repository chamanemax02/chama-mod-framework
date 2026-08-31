import type { ChamaPlugin } from './types.js';
import type { ChamaSocket } from '../core/ChamaSocket.js';
import type { MessageContext } from '../events/EventDispatcher.js';

/**
 * Anti-Call Plugin: Automatically rejects incoming audio/video calls
 */
export function antiCallPlugin(options?: { message?: string }): ChamaPlugin {
  return {
    name: 'anti-call',
    version: '1.0.0',
    description: 'Automatically rejects incoming WhatsApp calls and sends a polite notice',
    init: (chama: ChamaSocket) => {
      chama.calls.setAutoReject(true, options?.message || 'Auto-reject: Calls are disabled on this automated bot number.');
    }
  };
}

/**
 * Auto-Read Plugin: Automatically marks incoming messages as read
 */
export function autoReadPlugin(): ChamaPlugin {
  return {
    name: 'auto-read',
    version: '1.0.0',
    description: 'Automatically marks incoming messages as read',
    init: (chama: ChamaSocket) => {
      chama.events.onMessage(async (ctx: MessageContext) => {
        if (!ctx.fromMe && ctx.key.id) {
          await (chama.raw as any).readMessages([ctx.key]);
        }
      });
    }
  };
}

/**
 * Simple Command Router Plugin
 */
export function commandRouterPlugin(options: {
  prefix?: string;
  commands: Record<string, (ctx: MessageContext, args: string[]) => void | Promise<void>>;
}): ChamaPlugin {
  const prefix = options.prefix || '!';

  return {
    name: 'command-router',
    version: '1.0.0',
    description: 'Routes bot commands based on prefix',
    init: (chama: ChamaSocket) => {
      chama.events.onMessage(async (ctx: MessageContext) => {
        if (ctx.fromMe || !ctx.text || !ctx.text.startsWith(prefix)) return;

        const clean = ctx.text.slice(prefix.length).trim();
        const parts = clean.split(/\s+/);
        const commandName = parts[0]?.toLowerCase();
        const args = parts.slice(1);

        const handler = options.commands[commandName];
        if (handler) {
          await handler(ctx, args);
        }
      });
    }
  };
}
