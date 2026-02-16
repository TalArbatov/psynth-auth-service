import { Entity } from "./entity";
import { InvalidAmountError, AccountBlockedError, InsufficientFundsError, DailyLimitExceededError } from "../errors/account-errors";

class AccountEntity extends Entity {
    private username: string = "";

    private email: string = "";

    private passwordHash: string = "";

    private activeFlag: boolean = true;

    private createdAt: number = Date.now();

    private updatedAt: number = Date.now();

    public constructor(id?: string) {
        super("account", id);
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setPasswordHash(passwordHash: string): void {
        this.passwordHash = passwordHash;
    }

    public setActiveFlag(isActive: boolean): void {
        this.activeFlag = isActive;
    }

    public setCreatedTimestamp(timestamp: number): void {
        this.createdAt = timestamp;
    }

    public setUpdatedTimestamp(timestamp: number): void {
        this.updatedAt = timestamp;
    }


    public getUsername(): string {
        return this.username;
    }
    public getEmail(): string {
        return this.email;
    }
    public getPasswordHash(): string {
        return this.passwordHash;
    }
    public isActive(): boolean {
        return this.activeFlag;
    }
    public getCreatedTimestamp(): number {
        return this.createdAt;
    }
    public getUpdatedTimestamp(): number {
        return this.updatedAt;
    }

    public blockAccount(): void {
        this.activeFlag = false;
    }
}


export { AccountEntity };
