import { proto } from '../../WAProto/index.js';
import type { AuthenticationCreds } from '../Types/index.js';
import { type BinaryNode } from '../WABinary/index.js';
import type { ILogger } from './logger.js';
/**
 * Externally-provided WebAuthn assertion. The passkey/credential source lives
 * OUTSIDE the protocol layer: the caller signs the server's request options
 * however it likes (real authenticator, virtual authenticator, relay…) and
 * hands back the raw assertion + credential id.
 */
export type ShortcakeAssertionSigner = (requestOptions: Uint8Array) => Promise<{
    readonly credentialId: Uint8Array;
    readonly webauthnAssertion: Uint8Array;
}>;
export interface ShortcakeFlowOptions {
    readonly logger: ILogger;
    /** Send an IQ and await its result (error-free assertion done by the caller's query). */
    readonly query: (node: BinaryNode, timeoutMs?: number) => Promise<BinaryNode>;
    /** WebAuthn signer (passkey assertion), external, keeps credentials out of the protocol. */
    readonly signAssertion: ShortcakeAssertionSigner;
    /** Read the current credentials (noise/identity keys + ADV secret). */
    readonly getCreds: () => AuthenticationCreds;
    /** Persist a credentials patch (used to rotate the ADV secret on a prologue). */
    readonly updateCreds: (patch: Partial<AuthenticationCreds>) => void;
    /** Companion platform reported in the ephemeral identity. */
    readonly deviceType?: proto.DeviceProps.PlatformType;
    /** Verification code derived after the primary replies. */
    readonly emitVerificationCode?: (code: string) => void;
    /** Prologue accepted by the server; now waiting for the primary. */
    readonly emitPrologueSent?: () => void;
}
/**
 * Drives the companion side of the WhatsApp "Shortcake" passkey-linking
 * handshake (the `xmlns="md"` IQ exchange + commit/reveal ECDH). It owns the
 * wire protocol and crypto only; the WebAuthn assertion and the registration
 * payload are injected by the caller.
 */
export declare const makeShortcakeFlow: (opts: ShortcakeFlowOptions) => {
    handleIncomingNotification: (node: BinaryNode) => Promise<boolean>;
    executePrologue: (args?: {
        readonly requestOptions?: Uint8Array;
        readonly pairingHandoffProof?: Uint8Array;
    }) => Promise<void>;
    confirmVerificationCode: () => Promise<void>;
    hasSession: () => boolean;
    getVerificationCode: () => string | null;
    clearSession: () => void;
};
export type ShortcakeFlow = ReturnType<typeof makeShortcakeFlow>;
//# sourceMappingURL=shortcake.d.ts.map