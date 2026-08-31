import makeWASocket from '@whiskeysockets/baileys';
import { MessageManager } from '../messages/MessageManager.js';
import { CallManager } from '../calls/CallManager.js';
import { GroupManager } from '../groups/GroupManager.js';
import { NewsletterManager } from '../newsletters/NewsletterManager.js';
import { GameEngine } from '../games/GameEngine.js';
import { EventDispatcher } from '../events/EventDispatcher.js';
import { PluginManager } from '../plugins/PluginManager.js';
import { detectCapabilities } from './Capabilities.js';
export class ChamaSocket {
    raw;
    messages;
    calls;
    groups;
    newsletters;
    games;
    events;
    plugins;
    constructor(socket) {
        this.raw = socket;
        this.messages = new MessageManager(socket);
        this.calls = new CallManager(socket);
        this.groups = new GroupManager(socket);
        this.newsletters = new NewsletterManager(socket);
        this.games = new GameEngine(socket);
        this.events = new EventDispatcher(socket);
        this.plugins = new PluginManager(this);
    }
    /**
     * Return live capabilities and support breakdown of WhatsApp protocol features
     */
    features() {
        return detectCapabilities();
    }
    /**
     * Register a Chama plugin
     */
    async use(plugin) {
        await this.plugins.use(plugin);
        return this;
    }
    // ==========================================
    // Direct High-Level Message Methods
    // ==========================================
    async sendText(jid, text, options) {
        return await this.messages.sendText(jid, text, options);
    }
    async sendImage(jid, image, options) {
        return await this.messages.sendImage(jid, image, options);
    }
    async sendVideo(jid, video, options) {
        return await this.messages.sendVideo(jid, video, options);
    }
    async sendAudio(jid, audio, options) {
        return await this.messages.sendAudio(jid, audio, options);
    }
    async sendVoiceNote(jid, audio, options) {
        return await this.messages.sendVoiceNote(jid, audio, options);
    }
    async sendDocument(jid, doc, options) {
        return await this.messages.sendDocument(jid, doc, options);
    }
    async sendSticker(jid, sticker, options) {
        return await this.messages.sendSticker(jid, sticker, options);
    }
    async sendLocation(jid, options) {
        return await this.messages.sendLocation(jid, options);
    }
    async sendContact(jid, contacts, options) {
        return await this.messages.sendContact(jid, contacts, options);
    }
    async sendPoll(jid, options) {
        return await this.messages.sendPoll(jid, options);
    }
    async sendInteractive(jid, options) {
        return await this.messages.sendInteractive(jid, options);
    }
    async sendCarousel(jid, summary, cards) {
        return await this.messages.sendCarousel(jid, summary, cards);
    }
    async sendRichResponse(jid, options) {
        return await this.messages.sendRichResponse(jid, options);
    }
    async sendGameLaunchCard(jid, options) {
        return await this.games.sendGameLaunchCard(jid, options);
    }
    async sendRichHTMLCard(jid, title, bodyText, linkUrl, footer) {
        return await this.games.sendRichHTMLCard(jid, title, bodyText, linkUrl, footer);
    }
    async sendEvent(jid, options) {
        return await this.messages.sendEvent(jid, options);
    }
    async sendAlbum(jid, options) {
        return await this.messages.sendAlbum(jid, options);
    }
    async editMessage(jid, targetKey, newText) {
        return await this.messages.editMessage(jid, targetKey, newText);
    }
    async deleteMessage(jid, targetKey) {
        return await this.messages.deleteMessage(jid, targetKey);
    }
    async pinMessage(jid, targetKey, options) {
        return await this.messages.pinMessage(jid, targetKey, options);
    }
    async unpinMessage(jid, targetKey) {
        return await this.messages.unpinMessage(jid, targetKey);
    }
    async sendReaction(jid, emoji, targetKey) {
        return await this.messages.sendReaction(jid, emoji, targetKey);
    }
    // ==========================================
    // Direct High-Level Call Methods
    // ==========================================
    async createVoiceCallLink(event, timeoutMs) {
        return await this.calls.createVoiceCallLink(event, timeoutMs);
    }
    async createVideoCallLink(event, timeoutMs) {
        return await this.calls.createVideoCallLink(event, timeoutMs);
    }
    async createCallLink(options) {
        return await this.calls.createCallLink(options);
    }
    async rejectCall(callId, fromJid) {
        return await this.calls.rejectCall(callId, fromJid);
    }
    async call(toJid, options) {
        return await this.calls.call(toJid, options);
    }
    /**
     * Start a real-time Video Call Streaming Session playing a video file
     */
    async streamVideoCall(toJid, options) {
        return await this.calls.streamVideoCall(toJid, options);
    }
    async stopVideoStream() {
        await this.calls.stopVideoStream();
    }
    // ==========================================
    // Direct Event Helpers
    // ==========================================
    onMessage(handler) {
        return this.events.onMessage(handler);
    }
    onCall(handler) {
        return this.calls.onCall(handler);
    }
    onConnectionUpdate(handler) {
        return this.events.onConnectionUpdate(handler);
    }
}
/**
 * Factory to create a customized ChamaSocket instance
 */
export function makeChamaSocket(config) {
    const rawSocket = makeWASocket(config);
    return new ChamaSocket(rawSocket);
}
//# sourceMappingURL=ChamaSocket.js.map