export class NewsletterManager {
    sock;
    constructor(sock) {
        this.sock = sock;
    }
    /**
     * Create a new WhatsApp Newsletter / Channel
     */
    async create(name, description) {
        return await this.sock.newsletterCreate(name, description);
    }
    /**
     * Fetch newsletter metadata by JID or invite code
     */
    async getMetadata(type, key) {
        return await this.sock.newsletterMetadata(type, key);
    }
    /**
     * Update newsletter name/description/picture
     */
    async update(jid, updates) {
        return await this.sock.newsletterUpdate(jid, updates);
    }
    async updateName(jid, name) {
        return await this.sock.newsletterUpdateName(jid, name);
    }
    async updateDescription(jid, description) {
        return await this.sock.newsletterUpdateDescription(jid, description);
    }
    async updatePicture(jid, picture) {
        return await this.sock.newsletterUpdatePicture(jid, picture);
    }
    async removePicture(jid) {
        return await this.sock.newsletterRemovePicture(jid);
    }
    /**
     * Follow or unfollow a newsletter
     */
    async follow(jid) {
        return await this.sock.newsletterFollow(jid);
    }
    async unfollow(jid) {
        return await this.sock.newsletterUnfollow(jid);
    }
    /**
     * Mute or unmute newsletter notifications
     */
    async mute(jid) {
        return await this.sock.newsletterMute(jid);
    }
    async unmute(jid) {
        return await this.sock.newsletterUnmute(jid);
    }
    /**
     * React to a newsletter message
     */
    async reactMessage(jid, serverId, reaction) {
        return await this.sock.newsletterReactMessage(jid, serverId, reaction);
    }
    /**
     * Fetch messages from a newsletter
     */
    async fetchMessages(jid, count = 20, since = 0, after = 0) {
        return await this.sock.newsletterFetchMessages(jid, count, since, after);
    }
    /**
     * Get subscriber count
     */
    async getSubscribersCount(jid) {
        const res = await this.sock.newsletterSubscribers(jid);
        return res.subscribers;
    }
    /**
     * Delete newsletter
     */
    async deleteNewsletter(jid) {
        return await this.sock.newsletterDelete(jid);
    }
}
//# sourceMappingURL=NewsletterManager.js.map