import { DomainError } from "./domain-error";

export class ResourceNotFoundError extends DomainError {
    public readonly code = "RESOURCE_NOT_FOUND";
    constructor(accountId: string) {
        super(`${accountId} not found`);
        this.name = "ResourceNotFoundError";
    }
}

export class InvalidAmountError extends DomainError {
    public readonly code = "INVALID_AMOUNT";
    constructor(amount: number) {
        super(`Invalid amount: ${amount}. Amount must be > 0.`);
        this.name = "InvalidAmountError";
    }
}

export class AccountBlockedError extends DomainError {
    public readonly code = "ACCOUNT_BLOCKED";
    constructor() {
        super("Account is blocked.");
        this.name = "AccountBlockedError";
    }
}

export class InsufficientFundsError extends DomainError {
    public readonly code = "INSUFFICIENT_FUNDS";
    constructor() {
        super("Insufficient funds.");
        this.name = "InsufficientFundsError";
    }
}

export class DailyLimitExceededError extends DomainError {
    public readonly code = "DAILY_LIMIT_EXCEEDED";
    constructor() {
        super("Withdrawal exceeds daily limit.");
        this.name = "DailyLimitExceededError";
    }
}
