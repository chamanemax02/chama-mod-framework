import type { WASocket, GroupMetadata, ParticipantAction } from '../../index.js';
export declare class GroupManager {
    private readonly sock;
    constructor(sock: WASocket);
    /**
     * Fetch group metadata
     */
    getMetadata(jid: string): Promise<GroupMetadata>;
    /**
     * Create a new group
     */
    createGroup(subject: string, participants: string[]): Promise<GroupMetadata>;
    /**
     * Leave a group
     */
    leaveGroup(jid: string): Promise<void>;
    /**
     * Update group subject / name
     */
    updateSubject(jid: string, subject: string): Promise<void>;
    /**
     * Update group description
     */
    updateDescription(jid: string, description: string): Promise<void>;
    /**
     * Update group participants (add, remove, promote, demote)
     */
    updateParticipants(jid: string, participants: string[], action: ParticipantAction): Promise<{
        status: string;
        jid: string | undefined;
        content: import('../../index.js').BinaryNode;
    }[]>;
    addParticipants(jid: string, participants: string[]): Promise<{
        status: string;
        jid: string | undefined;
        content: import('../../index.js').BinaryNode;
    }[]>;
    removeParticipants(jid: string, participants: string[]): Promise<{
        status: string;
        jid: string | undefined;
        content: import('../../index.js').BinaryNode;
    }[]>;
    promoteParticipants(jid: string, participants: string[]): Promise<{
        status: string;
        jid: string | undefined;
        content: import('../../index.js').BinaryNode;
    }[]>;
    demoteParticipants(jid: string, participants: string[]): Promise<{
        status: string;
        jid: string | undefined;
        content: import('../../index.js').BinaryNode;
    }[]>;
    /**
     * Get group invite code
     */
    getInviteCode(jid: string): Promise<string | undefined>;
    /**
     * Revoke group invite code
     */
    revokeInviteCode(jid: string): Promise<string | undefined>;
    /**
     * Join group via invite code
     */
    acceptInvite(code: string): Promise<string | undefined>;
    /**
     * Update group settings (announcement mode, locked/unlocked edit info)
     */
    updateSetting(jid: string, setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked'): Promise<void>;
    /**
     * Set member add mode ('admin_add' | 'all_member_add')
     */
    setMemberAddMode(jid: string, mode: 'admin_add' | 'all_member_add'): Promise<void>;
    /**
     * Set join approval mode ('on' | 'off')
     */
    setJoinApprovalMode(jid: string, mode: 'on' | 'off'): Promise<void>;
    /**
     * Toggle ephemeral / disappearing messages duration
     */
    toggleEphemeral(jid: string, durationSeconds: number): Promise<void>;
    /**
     * Fetch all participating groups
     */
    fetchAllParticipating(): Promise<{
        [key: string]: GroupMetadata;
    }>;
}
//# sourceMappingURL=GroupManager.d.ts.map