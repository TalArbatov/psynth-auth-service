import { DomainError } from "./domain-error";

export class InvalidTransactionAmountError extends DomainError {
    public readonly code = "INVALID_TRANSACTION_AMOUNT";

    constructor(amount: number) {
        super(`Invalid transaction amount: ${amount}.`);
        this.name = "InvalidTransactionAmountError";
    }
}

export class TransactionAccountIdRequiredError extends DomainError {
    public readonly code = "TRANSACTION_ACCOUNT_ID_REQUIRED";

    constructor() {
        super("Transaction accountId is required.");
        this.name = "TransactionAccountIdRequiredError";
    }
}

export class InvalidTransactionTimestampError extends DomainError {
    public readonly code = "INVALID_TRANSACTION_TIMESTAMP";

    constructor(timestamp: number) {
        super(`Invalid transaction timestamp: ${timestamp}.`);
        this.name = "InvalidTransactionTimestampError";
    }
}

export class DailyLimitExceededError extends DomainError {
    public readonly code = "DAILY_LIMIT_EXCEEDED";

    constructor() {
        super('Withdraw amount exceeds daily limit');
        this.name = "DailyLimitExceedeError";
    }
}

export class TransactionNotFoundError extends DomainError {
    public readonly code = "TRANSACTION_NOT_FOUND";

    constructor(transactionId?: string) {
        super(
            transactionId
                ? `Transaction not found: ${transactionId}.`
                : "Transaction not found."
        );
        this.name = "TransactionNotFoundError";
    }
}

