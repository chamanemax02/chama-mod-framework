import type { WASocket, NewsletterMetadata, NewsletterUpdate, WAMediaUpload } from '@whiskeysockets/baileys';

export class NewsletterManager {
  constructor(private readonly sock: WASocket) {}

  /**
   * Create a new WhatsApp Newsletter / Channel
   */
  public async create(name: string, description?: string): Promise<NewsletterMetadata> {
    return await this.sock.newsletterCreate(name, description);
  }

  /**
   * Fetch newsletter metadata by JID or invite code
   */
  public async getMetadata(type: 'invite' | 'jid', key: string): Promise<NewsletterMetadata | null> {
    return await this.sock.newsletterMetadata(type, key);
  }

  /**
   * Update newsletter name/description/picture
   */
  public async update(jid: string, updates: NewsletterUpdate): Promise<unknown> {
    return await this.sock.newsletterUpdate(jid, updates);
  }

  public async updateName(jid: string, name: string): Promise<unknown> {
    return await this.sock.newsletterUpdateName(jid, name);
  }

  public async updateDescription(jid: string, description: string): Promise<unknown> {
    return await this.sock.newsletterUpdateDescription(jid, description);
  }

  public async updatePicture(jid: string, picture: WAMediaUpload): Promise<unknown> {
    return await this.sock.newsletterUpdatePicture(jid, picture);
  }

  public async removePicture(jid: string): Promise<unknown> {
    return await this.sock.newsletterRemovePicture(jid);
  }

  /**
   * Follow or unfollow a newsletter
   */
  public async follow(jid: string): Promise<unknown> {
    return await this.sock.newsletterFollow(jid);
  }

  public async unfollow(jid: string): Promise<unknown> {
    return await this.sock.newsletterUnfollow(jid);
  }

  /**
   * Mute or unmute newsletter notifications
   */
  public async mute(jid: string): Promise<unknown> {
    return await this.sock.newsletterMute(jid);
  }

  public async unmute(jid: string): Promise<unknown> {
    return await this.sock.newsletterUnmute(jid);
  }

  /**
   * React to a newsletter message
   */
  public async reactMessage(jid: string, serverId: string, reaction?: string): Promise<void> {
    return await this.sock.newsletterReactMessage(jid, serverId, reaction);
  }

  /**
   * Fetch messages from a newsletter
   */
  public async fetchMessages(jid: string, count = 20, since = 0, after = 0): Promise<any> {
    return await this.sock.newsletterFetchMessages(jid, count, since, after);
  }

  /**
   * Get subscriber count
   */
  public async getSubscribersCount(jid: string): Promise<number> {
    const res = await this.sock.newsletterSubscribers(jid);
    return res.subscribers;
  }

  /**
   * Delete newsletter
   */
  public async deleteNewsletter(jid: string): Promise<void> {
    return await this.sock.newsletterDelete(jid);
  }
}
