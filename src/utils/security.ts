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
export function sanitizeLogObject(obj: unknown, depth = 0): unknown {
  if (depth > 5) return '[Truncated]';
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeLogObject(item, depth + 1));
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      result[key] = '[PROTECTED_CREDENTIAL]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeLogObject(value, depth + 1);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function safeLog(message: string, meta?: unknown): void {
  if (meta) {
    const sanitized = sanitizeLogObject(meta);
    console.log(`[CHAMA-MOD] ${message}`, JSON.stringify(sanitized));
  } else {
    console.log(`[CHAMA-MOD] ${message}`);
  }
}
