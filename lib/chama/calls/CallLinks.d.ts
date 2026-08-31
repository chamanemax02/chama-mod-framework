import type { WASocket } from '../../index.js';
import type { CallLinkOptions, CallLinkResult } from '../types/calls.js';
export declare class CallLinksManager {
    private readonly sock;
    constructor(sock: WASocket);
    /**
     * Create a native WhatsApp Call Link (Audio or Video)
     */
    createCallLink(options: CallLinkOptions): Promise<CallLinkResult>;
    /**
     * Create a Voice Call Link
     */
    createVoiceCallLink(event?: {
        startTime: number;
    }, timeoutMs?: number): Promise<CallLinkResult>;
    /**
     * Create a Video Call Link
     */
    createVideoCallLink(event?: {
        startTime: number;
    }, timeoutMs?: number): Promise<CallLinkResult>;
}
//# sourceMappingURL=CallLinks.d.ts.map