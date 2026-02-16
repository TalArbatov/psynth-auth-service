import { describe, it, expect } from "vitest";
import { TransactionEntity } from '../../../src/app/entities/transaction-entity';
import { InvalidTransactionAmountError } from '../../../src/app/errors/transaction-errors';

describe("TransactionEntity", () => {
    describe("setAmount()", () => {
        it("sets a valid integer amount", () => {
            const tx = new TransactionEntity();

            tx.setAmount(100);

            expect(tx.getAmount()).toBe(100);
        });

        it("throws InvalidTransactionAmountError for NaN", () => {
            const tx = new TransactionEntity();

            expect(() => tx.setAmount(Number.NaN)).toThrowError(InvalidTransactionAmountError);
        });

        it("throws InvalidTransactionAmountError for Infinity", () => {
            const tx = new TransactionEntity();

            expect(() => tx.setAmount(Number.POSITIVE_INFINITY)).toThrowError(
                InvalidTransactionAmountError
            );
        });

        it("throws InvalidTransactionAmountError for -Infinity", () => {
            const tx = new TransactionEntity();

            expect(() => tx.setAmount(Number.NEGATIVE_INFINITY)).toThrowError(
                InvalidTransactionAmountError
            );
        });

        it("throws InvalidTransactionAmountError for non-integer amounts", () => {
            const tx = new TransactionEntity();

            expect(() => tx.setAmount(10.5)).toThrowError(InvalidTransactionAmountError);
        });

        it("throws InvalidTransactionAmountError for 0", () => {
            const tx = new TransactionEntity();

            expect(() => tx.setAmount(0)).toThrowError(InvalidTransactionAmountError);
        });

        it("allows negative integers (if debits are allowed in your domain)", () => {
            const tx = new TransactionEntity();

            tx.setAmount(-500);

            expect(tx.getAmount()).toBe(-500);
        });

        it("does not mutate the previous amount if the new amount is invalid", () => {
            const tx = new TransactionEntity();

            tx.setAmount(100);

            expect(() => tx.setAmount(0)).toThrowError(InvalidTransactionAmountError);

            expect(tx.getAmount()).toBe(100);
        });

        it("can optionally assert error metadata (if your error exposes the invalid amount)", () => {
            const tx = new TransactionEntity();

            try {
                tx.setAmount(0);
                expect.fail("Expected InvalidTransactionAmountError");
            } catch (err) {
                expect(err).toBeInstanceOf(InvalidTransactionAmountError);

                // Uncomment if your error has a field like `amount`
                // expect((err as InvalidTransactionAmountError).amount).toBe(0);

                // Or if you embed it in the message:
                // expect((err as Error).message).toContain("0");
            }
        });
    });

    describe("setAccountId() / getAccountId()", () => {
        it("sets and returns accountId", () => {
            const tx = new TransactionEntity();

            tx.setAccountId("acc_123");

            expect(tx.getAccountId()).toBe("acc_123");
        });
    });

    describe("setCreatedAt() / getCreatedAt()", () => {
        it("sets and returns createdAt", () => {
            const tx = new TransactionEntity();
            const date = 1_700_000_000_000;

            tx.setCreatedAt(date);

            expect(tx.getCreatedAt()).toBe(date);
        });

        it("defaults createdAt to a timestamp near now", () => {
            const before = Date.now();
            const tx = new TransactionEntity();
            const after = Date.now();

            expect(tx.getCreatedAt()).toBeGreaterThanOrEqual(before);
            expect(tx.getCreatedAt()).toBeLessThanOrEqual(after);
        });
    });
});
