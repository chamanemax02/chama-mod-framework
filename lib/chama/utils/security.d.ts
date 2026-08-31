/**
 * Security & Credential Protection Utilities
 */
/**
 * Recursively masks sensitive fields in log payloads to prevent accidental leaking of credentials
 */
export declare function sanitizeLogObject(obj: unknown, depth?: number): unknown;
export declare function safeLog(message: string, meta?: unknown): void;
//# sourceMappingURL=security.d.ts.map