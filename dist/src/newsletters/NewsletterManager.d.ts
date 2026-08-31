import type { WASocket, NewsletterMetadata, NewsletterUpdate, WAMediaUpload } from '@whiskeysockets/baileys';
export declare class NewsletterManager {
    private readonly sock;
    constructor(sock: WASocket);
    /**
     * Create a new WhatsApp Newsletter / Channel
     */
    create(name: string, description?: string): Promise<NewsletterMetadata>;
    /**
     * Fetch newsletter metadata by JID or invite code
     */
    getMetadata(type: 'invite' | 'jid', key: string): Promise<NewsletterMetadata | null>;
    /**
     * Update newsletter name/description/picture
     */
    update(jid: string, updates: NewsletterUpdate): Promise<unknown>;
    updateName(jid: string, name: string): Promise<unknown>;
    updateDescription(jid: string, description: string): Promise<unknown>;
    updatePicture(jid: string, picture: WAMediaUpload): Promise<unknown>;
    removePicture(jid: string): Promise<unknown>;
    /**
     * Follow or unfollow a newsletter
     */
    follow(jid: string): Promise<unknown>;
    unfollow(jid: string): Promise<unknown>;
    /**
     * Mute or unmute newsletter notifications
     */
    mute(jid: string): Promise<unknown>;
    unmute(jid: string): Promise<unknown>;
    /**
     * React to a newsletter message
     */
    reactMessage(jid: string, serverId: string, reaction?: string): Promise<void>;
    /**
     * Fetch messages from a newsletter
     */
    fetchMessages(jid: string, count?: number, since?: number, after?: number): Promise<any>;
    /**
     * Get subscriber count
     */
    getSubscribersCount(jid: string): Promise<number>;
    /**
     * Delete newsletter
     */
    deleteNewsletter(jid: string): Promise<void>;
}
//# sourceMappingURL=NewsletterManager.d.ts.map