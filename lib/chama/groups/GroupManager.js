import { formatToUserJid } from '../utils/jid.js';
export class GroupManager {
    sock;
    constructor(sock) {
        this.sock = sock;
    }
    /**
     * Fetch group metadata
     */
    async getMetadata(jid) {
        return await this.sock.groupMetadata(jid);
    }
    /**
     * Create a new group
     */
    async createGroup(subject, participants) {
        const formattedParticipants = participants.map((p) => formatToUserJid(p));
        return await this.sock.groupCreate(subject, formattedParticipants);
    }
    /**
     * Leave a group
     */
    async leaveGroup(jid) {
        return await this.sock.groupLeave(jid);
    }
    /**
     * Update group subject / name
     */
    async updateSubject(jid, subject) {
        return await this.sock.groupUpdateSubject(jid, subject);
    }
    /**
     * Update group description
     */
    async updateDescription(jid, description) {
        return await this.sock.groupUpdateDescription(jid, description);
    }
    /**
     * Update group participants (add, remove, promote, demote)
     */
    async updateParticipants(jid, participants, action) {
        const formattedParticipants = participants.map((p) => formatToUserJid(p));
        return await this.sock.groupParticipantsUpdate(jid, formattedParticipants, action);
    }
    async addParticipants(jid, participants) {
        return await this.updateParticipants(jid, participants, 'add');
    }
    async removeParticipants(jid, participants) {
        return await this.updateParticipants(jid, participants, 'remove');
    }
    async promoteParticipants(jid, participants) {
        return await this.updateParticipants(jid, participants, 'promote');
    }
    async demoteParticipants(jid, participants) {
        return await this.updateParticipants(jid, participants, 'demote');
    }
    /**
     * Get group invite code
     */
    async getInviteCode(jid) {
        return await this.sock.groupInviteCode(jid);
    }
    /**
     * Revoke group invite code
     */
    async revokeInviteCode(jid) {
        return await this.sock.groupRevokeInvite(jid);
    }
    /**
     * Join group via invite code
     */
    async acceptInvite(code) {
        return await this.sock.groupAcceptInvite(code);
    }
    /**
     * Update group settings (announcement mode, locked/unlocked edit info)
     */
    async updateSetting(jid, setting) {
        return await this.sock.groupSettingUpdate(jid, setting);
    }
    /**
     * Set member add mode ('admin_add' | 'all_member_add')
     */
    async setMemberAddMode(jid, mode) {
        return await this.sock.groupMemberAddMode(jid, mode);
    }
    /**
     * Set join approval mode ('on' | 'off')
     */
    async setJoinApprovalMode(jid, mode) {
        return await this.sock.groupJoinApprovalMode(jid, mode);
    }
    /**
     * Toggle ephemeral / disappearing messages duration
     */
    async toggleEphemeral(jid, durationSeconds) {
        return await this.sock.groupToggleEphemeral(jid, durationSeconds);
    }
    /**
     * Fetch all participating groups
     */
    async fetchAllParticipating() {
        return await this.sock.groupFetchAllParticipating();
    }
}
//# sourceMappingURL=GroupManager.js.map