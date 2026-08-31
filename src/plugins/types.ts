import type { ChamaSocket } from '../core/ChamaSocket.js';

export interface ChamaPlugin {
  name: string;
  version?: string;
  description?: string;
  init: (chama: ChamaSocket) => void | Promise<void>;
  onDestroy?: () => void | Promise<void>;
}
