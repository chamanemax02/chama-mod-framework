import type { ChamaPlugin } from './types.js';
import type { MessageContext } from '../events/EventDispatcher.js';
/**
 * Anti-Call Plugin: Automatically rejects incoming audio/video calls
 */
export declare function antiCallPlugin(options?: {
    message?: string;
}): ChamaPlugin;
/**
 * Auto-Read Plugin: Automatically marks incoming messages as read
 */
export declare function autoReadPlugin(): ChamaPlugin;
/**
 * Simple Command Router Plugin
 */
export declare function commandRouterPlugin(options: {
    prefix?: string;
    commands: Record<string, (ctx: MessageContext, args: string[]) => void | Promise<void>>;
}): ChamaPlugin;
//# sourceMappingURL=BuiltinPlugins.d.ts.map