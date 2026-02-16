import { describe, it, expect, vi, beforeEach } from "vitest";

import { WithdrawFromAccountUseCase } from "../../../src/app/use-cases/withdraw-use-case";
import { ResourceNotFoundError } from "../../../src/app/errors/account-errors";
import { DailyLimitExceededError } from "../../../src/app/errors/transaction-errors";
import { TransactionEntity } from "../../../src/app/entities/transaction-entity";

describe("WithdrawFromAccountUseCase", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function buildTxManager(uow: any) {
        return {
            withTransaction: vi.fn(async (fn: any) => fn(uow)),
        };
    }

    it("should withdraw, update account, and save a negative transaction", async () => {
        const now = Date.parse("2026-01-20T12:00:00.000Z");

        const account = {
            getDailyWithdrawlLimit: vi.fn().mockReturnValue(1000),
            withdraw: vi.fn(),
        };

        const accounts = {
            find: vi.fn().mockResolvedValue(account),
            update: vi.fn().mockResolvedValue(undefined),
        };

        const transactions = {
            getWithdrawalAmountByDateBoundary: vi.fn().mockResolvedValue(200),
            save: vi.fn().mockResolvedValue(undefined),
        };

        const uow = { accounts, transactions };
        const txManager = buildTxManager(uow);

        const useCase = new WithdrawFromAccountUseCase(txManager as any, () => now);

        await useCase.execute({ accountId: "acc_1", amount: 300 });

        // Transaction wrapper called
        expect(txManager.withTransaction).toHaveBeenCalledTimes(1);

        // account lookup
        expect(accounts.find).toHaveBeenCalledWith("acc_1");

        // boundary passed correctly
        // const now = Date.parse("2026-01-20T12:00:00.000Z");

        const expectedBoundary = (() => {
            const d = new Date(now);
            const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
            return { startDate: start.getTime(), endDate: end.getTime() };
        })();

        const boundary = transactions.getWithdrawalAmountByDateBoundary.mock.calls[0][1];
        expect(boundary).toEqual(expectedBoundary);

        // check daily limit logic calls
        expect(transactions.getWithdrawalAmountByDateBoundary).toHaveBeenCalledWith("acc_1", boundary);

        // domain operation
        expect(account.withdraw).toHaveBeenCalledWith(300);

        // persist account
        expect(accounts.update).toHaveBeenCalledWith("acc_1", account);

        // transaction saved
        expect(transactions.save).toHaveBeenCalledTimes(1);
        const savedTx = transactions.save.mock.calls[0][0] as TransactionEntity;

        expect(savedTx).toBeInstanceOf(TransactionEntity);
        expect(savedTx.getAccountId()).toBe("acc_1");
        expect(savedTx.getAmount()).toBe(-300);
        expect(savedTx.getCreatedAt()).toBe(now);
    });

    it("should throw ResourceNotFoundError when account does not exist", async () => {
        const accounts = {
            find: vi.fn().mockResolvedValue(null),
            update: vi.fn(),
        };

        const transactions = {
            getWithdrawalAmountByDateBoundary: vi.fn(),
            save: vi.fn(),
        };

        const uow = { accounts, transactions };
        const txManager = buildTxManager(uow);

        const useCase = new WithdrawFromAccountUseCase(txManager as any, () => 123);

        await expect(
            useCase.execute({ accountId: "acc_missing", amount: 100 })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);

        expect(accounts.find).toHaveBeenCalledWith("acc_missing");

        // should stop immediately
        expect(transactions.getWithdrawalAmountByDateBoundary).not.toHaveBeenCalled();
        expect(accounts.update).not.toHaveBeenCalled();
        expect(transactions.save).not.toHaveBeenCalled();
    });

    it("should throw DailyLimitExceededError when amount exceeds remaining daily limit", async () => {
        // dailyLimit=500, withdrawnToday=450 => remaining=50, requested=100 -> throws
        const account = {
            getDailyWithdrawlLimit: vi.fn().mockReturnValue(500),
            withdraw: vi.fn(),
        };

        const accounts = {
            find: vi.fn().mockResolvedValue(account),
            update: vi.fn(),
        };

        const transactions = {
            getWithdrawalAmountByDateBoundary: vi.fn().mockResolvedValue(450),
            save: vi.fn(),
        };

        const uow = { accounts, transactions };
        const txManager = buildTxManager(uow);

        const useCase = new WithdrawFromAccountUseCase(txManager as any, () => Date.now());

        await expect(
            useCase.execute({ accountId: "acc_1", amount: 100 })
        ).rejects.toBeInstanceOf(DailyLimitExceededError);

        // should not proceed to withdraw/update/save
        expect(account.withdraw).not.toHaveBeenCalled();
        expect(accounts.update).not.toHaveBeenCalled();
        expect(transactions.save).not.toHaveBeenCalled();
    });

    it("should bubble up if account.withdraw throws (no update/save)", async () => {
        const account = {
            getDailyWithdrawlLimit: vi.fn().mockReturnValue(1000),
            withdraw: vi.fn(() => {
                throw new Error("Insufficient funds");
            }),
        };

        const accounts = {
            find: vi.fn().mockResolvedValue(account),
            update: vi.fn(),
        };

        const transactions = {
            getWithdrawalAmountByDateBoundary: vi.fn().mockResolvedValue(0),
            save: vi.fn(),
        };

        const uow = { accounts, transactions };
        const txManager = buildTxManager(uow);

        const useCase = new WithdrawFromAccountUseCase(txManager as any);

        await expect(
            useCase.execute({ accountId: "acc_1", amount: 50 })
        ).rejects.toThrow("Insufficient funds");

        expect(accounts.update).not.toHaveBeenCalled();
        expect(transactions.save).not.toHaveBeenCalled();
    });
});
