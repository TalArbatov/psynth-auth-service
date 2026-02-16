import { Entity } from "./entity";
import { InvalidAmountError, AccountBlockedError, InsufficientFundsError, DailyLimitExceededError } from "../errors/account-errors";

class AccountEntity extends Entity {
    private username: string = "";

    private passwordHash: string = "";

    private activeFlag: boolean = true;

    private createdTimestamp: number = Date.now();

    private updatedAt: number = Date.now();

    public constructor(id?: string) {
        super("account", id);
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public setPasswordHash(passwordHash: string): void {
        this.passwordHash = passwordHash;
    }

    public setActiveFlag(isActive: boolean): void {
        this.activeFlag = isActive;
    }

    public setCreatedTimestamp(timestamp: number): void {
        this.createdTimestamp = timestamp;
    }

    public setUpdatedAt(timestamp: number): void {
        this.updatedAt = timestamp;
    }


    public getUsername(): string {
        return this.username;
    }
    public getPasswordHash(): string {
        return this.passwordHash;
    }
    public isActive(): boolean {
        return this.activeFlag;
    }
    public getCreatedTimestamp(): number {
        return this.createdTimestamp;
    }
    public getUpdatedAt(): number {
        return this.updatedAt;
    }

    public blockAccount(): void {
        this.activeFlag = false;
    }
}


export { AccountEntity };
