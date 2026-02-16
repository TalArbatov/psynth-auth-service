import { describe, it, expect, beforeEach } from "vitest";

import { DomainError } from "../../../src/app/errors/domain-error";
import { AccountEntity } from "../../../src/app/entities/account-entity";
import {
    InvalidAmountError,
    AccountBlockedError,
    InsufficientFundsError,
    DailyLimitExceededError,
} from "../../../src/app/errors/account-errors";

describe("AccountEntity", () => {
    let entity: AccountEntity;

    beforeEach(() => {
        entity = new AccountEntity();
        entity.setActiveFlag(true);
        entity.setBalance(0);
        entity.setDailyWithdrawlLimit(0);
    });

    describe("defaults", () => {
        it("should initialize with correct defaults", () => {
            const acc = new AccountEntity();

            expect(acc.getPersonId()).toBe("");
            expect(acc.getBalance()).toBe(0);
            expect(acc.getDailyWithdrawlLimit()).toBe(0);
            expect(acc.isActive()).toBe(true);
            expect(acc.getAccountType()).toBe(0);

            const ts = acc.getCreatedTimestamp();
            expect(typeof ts).toBe("number");
            expect(ts).toBeGreaterThan(0);
        });
    });

    describe("deposit()", () => {
        it("should throw InvalidAmountError if amount is 0", () => {
            expect(() => entity.deposit(0)).toThrow(InvalidAmountError);
        });

        it("should throw InvalidAmountError if amount is negative", () => {
            expect(() => entity.deposit(-10)).toThrow(InvalidAmountError);
        });

        it("should throw AccountBlockedError if account is blocked", () => {
            entity.blockAccount();

            expect(() => entity.deposit(100)).toThrow(AccountBlockedError);
        });

        it("should increase balance when amount is positive", () => {
            entity.deposit(100);
            expect(entity.getBalance()).toBe(100);

            entity.deposit(50);
            expect(entity.getBalance()).toBe(150);
        });

        it("should throw a DomainError subtype on invalid deposit", () => {
            try {
                entity.deposit(-1);
                expect.fail("Expected deposit to throw");
            } catch (err) {
                expect(err).toBeInstanceOf(DomainError);
            }
        });
    });

    describe("withdraw()", () => {
        it("should throw InvalidAmountError if amount is 0", () => {
            expect(() => entity.withdraw(0)).toThrow(InvalidAmountError);
        });

        it("should throw InvalidAmountError if amount is negative", () => {
            expect(() => entity.withdraw(-5)).toThrow(InvalidAmountError);
        });

        it("should throw AccountBlockedError if account is blocked", () => {
            entity.setBalance(100);
            entity.blockAccount();

            expect(() => entity.withdraw(10)).toThrow(AccountBlockedError);
        });

        it("should throw InsufficientFundsError if amount > balance", () => {
            entity.setBalance(50);
            entity.setDailyWithdrawlLimit(1000);

            expect(() => entity.withdraw(60)).toThrow(InsufficientFundsError);
        });

        it("should throw DailyLimitExceededError if amount > dailyWithdrawlLimit", () => {
            entity.setBalance(1000);
            entity.setDailyWithdrawlLimit(100);

            expect(() => entity.withdraw(200)).toThrow(DailyLimitExceededError);
        });

        it("should decrease balance when withdrawal is valid", () => {
            entity.setBalance(500);
            entity.setDailyWithdrawlLimit(300);

            entity.withdraw(200);
            expect(entity.getBalance()).toBe(300);
        });

        it("should allow withdrawal equal to balance (if within daily limit)", () => {
            entity.setBalance(200);
            entity.setDailyWithdrawlLimit(200);

            entity.withdraw(200);
            expect(entity.getBalance()).toBe(0);
        });

        it("should allow withdrawal equal to dailyWithdrawlLimit (if within balance)", () => {
            entity.setBalance(500);
            entity.setDailyWithdrawlLimit(150);

            entity.withdraw(150);
            expect(entity.getBalance()).toBe(350);
        });

        it("should throw a DomainError subtype on invalid withdrawal", () => {
            entity.setBalance(0);
            entity.setDailyWithdrawlLimit(1000);

            try {
                entity.withdraw(10);
                expect.fail("Expected withdraw to throw");
            } catch (err) {
                expect(err).toBeInstanceOf(DomainError);
            }
        });
    });
});
