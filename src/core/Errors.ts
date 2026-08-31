/**
 * Base custom error for CHAMA MOD Framework
 */
export class ChamaError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code = 'CHAMA_ERROR', details?: unknown) {
    super(`[CHAMA-MOD] ${message}`);
    this.name = 'ChamaError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when an unsupported WhatsApp Web protocol feature is requested
 */
export class UnsupportedFeatureError extends ChamaError {
  public readonly feature: string;
  public readonly reason: string;

  constructor(feature: string, reason: string) {
    super(
      `Feature "${feature}" is not supported: ${reason}`,
      'UNSUPPORTED_FEATURE',
      { feature, reason }
    );
    this.name = 'UnsupportedFeatureError';
    this.feature = feature;
    this.reason = reason;
  }
}

/**
 * Thrown for validation failures in builders or parameters
 */
export class ValidationError extends ChamaError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(`Validation failed: ${message}`, 'VALIDATION_ERROR', { field });
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Thrown when protocol or socket operations fail
 */
export class ProtocolError extends ChamaError {
  constructor(message: string, details?: unknown) {
    super(`Protocol operation failed: ${message}`, 'PROTOCOL_ERROR', details);
    this.name = 'ProtocolError';
  }
}
