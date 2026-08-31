/**
 * Security & Credential Protection Utilities
 */
const SENSITIVE_KEYS = [
    'privKey',
    'privateKey',
    'noiseKey',
    'signedIdentityKey',
    'signedPreKey',
    'identityKey',
    'advSecretKey',
    'creds',
    'secret',
    'password',
    'token'
];
/**
 * Recursively masks sensitive fields in log payloads to prevent accidental leaking of credentials
 */
export function sanitizeLogObject(obj, depth = 0) {
    if (depth > 5)
        return '[Truncated]';
    if (!obj || typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj)) {
        return obj.map((item) => sanitizeLogObject(item, depth + 1));
    }
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
            result[key] = '[PROTECTED_CREDENTIAL]';
        }
        else if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeLogObject(value, depth + 1);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
export function safeLog(message, meta) {
    if (meta) {
        const sanitized = sanitizeLogObject(meta);
        console.log(`[CHAMA-MOD] ${message}`, JSON.stringify(sanitized));
    }
    else {
        console.log(`[CHAMA-MOD] ${message}`);
    }
}
//# sourceMappingURL=security.js.map