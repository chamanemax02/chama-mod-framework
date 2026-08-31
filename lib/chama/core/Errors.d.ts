/**
 * Base custom error for CHAMA MOD Framework
 */
export declare class ChamaError extends Error {
    readonly code: string;
    readonly details?: unknown;
    constructor(message: string, code?: string, details?: unknown);
}
/**
 * Thrown when an unsupported WhatsApp Web protocol feature is requested
 */
export declare class UnsupportedFeatureError extends ChamaError {
    readonly feature: string;
    readonly reason: string;
    constructor(feature: string, reason: string);
}
/**
 * Thrown for validation failures in builders or parameters
 */
export declare class ValidationError extends ChamaError {
    readonly field?: string;
    constructor(message: string, field?: string);
}
/**
 * Thrown when protocol or socket operations fail
 */
export declare class ProtocolError extends ChamaError {
    constructor(message: string, details?: unknown);
}
//# sourceMappingURL=Errors.d.ts.map