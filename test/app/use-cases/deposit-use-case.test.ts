import { describe, it, expect, vi, beforeEach } from "vitest";
import { DepositToAccountUseCase } from "../../../src/app/use-cases/deposit-use-case";
import { ResourceNotFoundError } from "../../../src/app/errors/account-errors";
import { TransactionEntity } from "../../../src/app/entities/transaction-entity";

describe("DepositUseCase", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function buildTxManager(uow: any) {
        return {
            withTransaction: vi.fn(async (fn: any) => {
                return fn(uow);
            }),
        };
    }

    it("should deposit, update account, and save a transaction", async () => {
        const now = 1700000000000;

        const account = {
            deposit: vi.fn(),
        };

        const accounts = {
            find: vi.fn().mockResolvedValue(account),
            update: vi.fn().mockResolvedValue(undefined),
        };

        const transactions = {
            save: vi.fn().mockResolvedValue(undefined),
        };

        const uow = { accounts, transactions };
        const txManager = buildTxManager(uow);

        const useCase = new DepositToAccountUseCase(txManager as any, () => now);

        await useCase.execute({ accountId: "acc_1", amount: 250 });

        // transaction wrapper called once
        expect(txManager.withTransaction).toHaveBeenCalledTimes(1);

        // account lookup
        expect(accounts.find).toHaveBeenCalledWith("acc_1");

        // domain action
        expect(account.deposit).toHaveBeenCalledWith(250);

        // persistence
        expect(accounts.update).toHaveBeenCalledTimes(1);
        expect(accounts.update).toHaveBeenCalledWith("acc_1", account);

        // transaction saved with correct entity values
        expect(transactions.save).toHaveBeenCalledTimes(1);
        const savedTx = transactions.save.mock.calls[0][0] as TransactionEntity;

        expect(savedTx).toBeInstanceOf(TransactionEntity);
        expect(savedTx.getAccountId()).toBe("acc_1");
        expect(savedTx.getAmount()).toBe(250);
        expect(savedTx.getCreatedAt()).toBe(now);
    });

    it("should throw ResourceNotFoundError when account does not exist", async () => {
        const accounts = {
            find: vi.fn().mockResolvedValue(null),
            update: vi.fn(),
        };

        const transactions = {
            save: vi.fn(),
        };

        const uow = { accounts, transactions };
        const txManager = buildTxManager(uow);

        const useCase = new DepositToAccountUseCase(txManager as any, () => 123);

        await expect(
            useCase.execute({ accountId: "acc_missing", amount: 100 })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);

        expect(accounts.find).toHaveBeenCalledWith("acc_missing");

        // should not persist anything
        expect(accounts.update).not.toHaveBeenCalled();
        expect(transactions.save).not.toHaveBeenCalled();
    });

    it("should bubble up if account.deposit throws (no update/save)", async () => {
        const account = {
            deposit: vi.fn(() => {
                throw new Error("Invalid amount");
            }),
        };

        const accounts = {
            find: vi.fn().mockResolvedValue(account),
            update: vi.fn(),
        };

        const transactions = {
            save: vi.fn(),
        };

        const uow = { accounts, transactions };
        const txManager = buildTxManager(uow);

        const useCase = new DepositToAccountUseCase(txManager as any);

        await expect(
            useCase.execute({ accountId: "acc_1", amount: -10 })
        ).rejects.toThrow("Invalid amount");

        expect(accounts.update).not.toHaveBeenCalled();
        expect(transactions.save).not.toHaveBeenCalled();
    });
});
