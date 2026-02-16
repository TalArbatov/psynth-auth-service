import { DomainError } from "../../app/errors/domain-error";
import {
    ServerError,
    ConflictError,
    GeneralError,
} from "./server-error";

// Import your domain errors
import { InvalidAmountError, AccountBlockedError, ResourceNotFoundError } from '../../app/errors/account-errors';
import { InvalidTransactionAmountError } from "../../app/errors/transaction-errors";

/**
 * Map domain errors (pure business rules) to HTTP-facing ServerError objects.
 * Keep HTTP status logic HERE, not in the domain.
 */
export function mapDomainErrorToServerError(err: DomainError): ServerError {
    // 400 - invalid inputs (business validation)
    if (err instanceof InvalidAmountError) {
        return new ServerError({
            message: err.message,
            statusCode: 400,
            code: err.code,
            expose: true,
            cause: err,
        });
    }

    if (err instanceof InvalidTransactionAmountError) {
        return new ServerError({
            message: err.message,
            statusCode: 400,
            code: err.code,
            expose: true,
            cause: err,
        });
    }

    if (err instanceof ResourceNotFoundError) {
        return new ServerError({
            message: err.message,
            statusCode: 404,
            code: err.code,
            expose: true,
            cause: err,
        });
    }

    // 409 - conflicts / invalid state transitions
    if (err instanceof AccountBlockedError) {
        return new ConflictError(err.message);
    }

    // Fallback: treat as 422 (or 400/409 depending on your taste)
    return new ServerError({
        message: err.message,
        statusCode: 422,
        code: err.code ?? "DOMAIN_ERROR",
        details: err,
        expose: true,
        cause: err,
    });
}
