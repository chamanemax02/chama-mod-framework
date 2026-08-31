/**
 * Anti-Call Plugin: Automatically rejects incoming audio/video calls
 */
export function antiCallPlugin(options) {
    return {
        name: 'anti-call',
        version: '1.0.0',
        description: 'Automatically rejects incoming WhatsApp calls and sends a polite notice',
        init: (chama) => {
            chama.calls.setAutoReject(true, options?.message || 'Auto-reject: Calls are disabled on this automated bot number.');
        }
    };
}
/**
 * Auto-Read Plugin: Automatically marks incoming messages as read
 */
export function autoReadPlugin() {
    return {
        name: 'auto-read',
        version: '1.0.0',
        description: 'Automatically marks incoming messages as read',
        init: (chama) => {
            chama.events.onMessage(async (ctx) => {
                if (!ctx.fromMe && ctx.key.id) {
                    await chama.raw.readMessages([ctx.key]);
                }
            });
        }
    };
}
/**
 * Simple Command Router Plugin
 */
export function commandRouterPlugin(options) {
    const prefix = options.prefix || '!';
    return {
        name: 'command-router',
        version: '1.0.0',
        description: 'Routes bot commands based on prefix',
        init: (chama) => {
            chama.events.onMessage(async (ctx) => {
                if (ctx.fromMe || !ctx.text || !ctx.text.startsWith(prefix))
                    return;
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
//# sourceMappingURL=BuiltinPlugins.js.map