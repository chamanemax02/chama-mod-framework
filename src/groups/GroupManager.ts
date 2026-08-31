import type { WASocket, GroupMetadata, ParticipantAction, WAMessageKey, proto } from '@whiskeysockets/baileys';
import { formatToUserJid } from '../utils/jid.js';

export class GroupManager {
  constructor(private readonly sock: WASocket) {}

  /**
   * Fetch group metadata
   */
  public async getMetadata(jid: string): Promise<GroupMetadata> {
    return await this.sock.groupMetadata(jid);
  }

  /**
   * Create a new group
   */
  public async createGroup(subject: string, participants: string[]): Promise<GroupMetadata> {
    const formattedParticipants = participants.map((p) => formatToUserJid(p));
    return await this.sock.groupCreate(subject, formattedParticipants);
  }

  /**
   * Leave a group
   */
  public async leaveGroup(jid: string): Promise<void> {
    return await this.sock.groupLeave(jid);
  }

  /**
   * Update group subject / name
   */
  public async updateSubject(jid: string, subject: string): Promise<void> {
    return await this.sock.groupUpdateSubject(jid, subject);
  }

  /**
   * Update group description
   */
  public async updateDescription(jid: string, description: string): Promise<void> {
    return await this.sock.groupUpdateDescription(jid, description);
  }

  /**
   * Update group participants (add, remove, promote, demote)
   */
  public async updateParticipants(
    jid: string,
    participants: string[],
    action: ParticipantAction
  ) {
    const formattedParticipants = participants.map((p) => formatToUserJid(p));
    return await this.sock.groupParticipantsUpdate(jid, formattedParticipants, action);
  }

  public async addParticipants(jid: string, participants: string[]) {
    return await this.updateParticipants(jid, participants, 'add');
  }

  public async removeParticipants(jid: string, participants: string[]) {
    return await this.updateParticipants(jid, participants, 'remove');
  }

  public async promoteParticipants(jid: string, participants: string[]) {
    return await this.updateParticipants(jid, participants, 'promote');
  }

  public async demoteParticipants(jid: string, participants: string[]) {
    return await this.updateParticipants(jid, participants, 'demote');
  }

  /**
   * Get group invite code
   */
  public async getInviteCode(jid: string): Promise<string | undefined> {
    return await this.sock.groupInviteCode(jid);
  }

  /**
   * Revoke group invite code
   */
  public async revokeInviteCode(jid: string): Promise<string | undefined> {
    return await this.sock.groupRevokeInvite(jid);
  }

  /**
   * Join group via invite code
   */
  public async acceptInvite(code: string): Promise<string | undefined> {
    return await this.sock.groupAcceptInvite(code);
  }

  /**
   * Update group settings (announcement mode, locked/unlocked edit info)
   */
  public async updateSetting(
    jid: string,
    setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked'
  ): Promise<void> {
    return await this.sock.groupSettingUpdate(jid, setting);
  }

  /**
   * Set member add mode ('admin_add' | 'all_member_add')
   */
  public async setMemberAddMode(jid: string, mode: 'admin_add' | 'all_member_add'): Promise<void> {
    return await this.sock.groupMemberAddMode(jid, mode);
  }

  /**
   * Set join approval mode ('on' | 'off')
   */
  public async setJoinApprovalMode(jid: string, mode: 'on' | 'off'): Promise<void> {
    return await this.sock.groupJoinApprovalMode(jid, mode);
  }

  /**
   * Toggle ephemeral / disappearing messages duration
   */
  public async toggleEphemeral(jid: string, durationSeconds: number): Promise<void> {
    return await this.sock.groupToggleEphemeral(jid, durationSeconds);
  }

  /**
   * Fetch all participating groups
   */
  public async fetchAllParticipating(): Promise<{ [key: string]: GroupMetadata }> {
    return await this.sock.groupFetchAllParticipating();
  }
}
