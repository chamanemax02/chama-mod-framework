/**
 * Base custom error for CHAMA MOD Framework
 */
export class ChamaError extends Error {
    code;
    details;
    constructor(message, code = 'CHAMA_ERROR', details) {
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
    feature;
    reason;
    constructor(feature, reason) {
        super(`Feature "${feature}" is not supported: ${reason}`, 'UNSUPPORTED_FEATURE', { feature, reason });
        this.name = 'UnsupportedFeatureError';
        this.feature = feature;
        this.reason = reason;
    }
}
/**
 * Thrown for validation failures in builders or parameters
 */
export class ValidationError extends ChamaError {
    field;
    constructor(message, field) {
        super(`Validation failed: ${message}`, 'VALIDATION_ERROR', { field });
        this.name = 'ValidationError';
        this.field = field;
    }
}
/**
 * Thrown when protocol or socket operations fail
 */
export class ProtocolError extends ChamaError {
    constructor(message, details) {
        super(`Protocol operation failed: ${message}`, 'PROTOCOL_ERROR', details);
        this.name = 'ProtocolError';
    }
}
//# sourceMappingURL=Errors.js.map