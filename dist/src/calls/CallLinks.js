import { ProtocolError } from '../core/Errors.js';
export class CallLinksManager {
    sock;
    constructor(sock) {
        this.sock = sock;
    }
    /**
     * Create a native WhatsApp Call Link (Audio or Video)
     */
    async createCallLink(options) {
        try {
            const token = await this.sock.createCallLink(options.type, options.event, options.timeoutMs);
            if (!token) {
                throw new ProtocolError('WhatsApp server returned an empty call link token');
            }
            const url = `https://call.whatsapp.com/${options.type}/${token}`;
            return {
                token,
                type: options.type,
                url,
                startTime: options.event?.startTime
            };
        }
        catch (error) {
            throw new ProtocolError(`Failed to create ${options.type} call link: ${error.message}`, error);
        }
    }
    /**
     * Create a Voice Call Link
     */
    async createVoiceCallLink(event, timeoutMs) {
        return await this.createCallLink({ type: 'audio', event, timeoutMs });
    }
    /**
     * Create a Video Call Link
     */
    async createVideoCallLink(event, timeoutMs) {
        return await this.createCallLink({ type: 'video', event, timeoutMs });
    }
}
//# sourceMappingURL=CallLinks.js.map