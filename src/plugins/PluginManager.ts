import type { ChamaSocket } from '../core/ChamaSocket.js';
import type { ChamaPlugin } from './types.js';

export class PluginManager {
  private readonly plugins: Map<string, ChamaPlugin> = new Map();

  constructor(private readonly chama: ChamaSocket) {}

  /**
   * Register and initialize a plugin
   */
  public async use(plugin: ChamaPlugin): Promise<this> {
    if (this.plugins.has(plugin.name)) {
      console.warn(`[CHAMA-MOD] Plugin "${plugin.name}" is already registered. Skipping.`);
      return this;
    }

    try {
      await plugin.init(this.chama);
      this.plugins.set(plugin.name, plugin);
      console.log(`[CHAMA-MOD] Loaded plugin: ${plugin.name} (v${plugin.version || '1.0.0'})`);
    } catch (err) {
      console.error(`[CHAMA-MOD] Failed to initialize plugin "${plugin.name}":`, err);
    }

    return this;
  }

  /**
   * Unregister and cleanup a plugin
   */
  public async unregister(pluginName: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) return false;

    if (plugin.onDestroy) {
      try {
        await plugin.onDestroy();
      } catch (err) {
        console.error(`[CHAMA-MOD] Error destroying plugin "${pluginName}":`, err);
      }
    }

    this.plugins.delete(pluginName);
    return true;
  }

  /**
   * List all registered plugins
   */
  public list(): string[] {
    return Array.from(this.plugins.keys());
  }
}
