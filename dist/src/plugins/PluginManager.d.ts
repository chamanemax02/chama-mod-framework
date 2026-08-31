import type { ChamaSocket } from '../core/ChamaSocket.js';
import type { ChamaPlugin } from './types.js';
export declare class PluginManager {
    private readonly chama;
    private readonly plugins;
    constructor(chama: ChamaSocket);
    /**
     * Register and initialize a plugin
     */
    use(plugin: ChamaPlugin): Promise<this>;
    /**
     * Unregister and cleanup a plugin
     */
    unregister(pluginName: string): Promise<boolean>;
    /**
     * List all registered plugins
     */
    list(): string[];
}
//# sourceMappingURL=PluginManager.d.ts.map