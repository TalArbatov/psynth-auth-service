import { TransactionEntity } from "../entities/transaction-entity";

interface TransactionEntityGateway {
    save(transactionEntity: TransactionEntity): Promise<void>;

    listByAccountId(accountId: string): Promise<TransactionEntity[]>;

    listByDateBoundary(
        accountId: string,
        boundary: { startDate: number; endDate: number }
    ): Promise<TransactionEntity[]>;

    getWithdrawalAmountByDateBoundary(
        accountId: string,
        boundary: { startDate: number; endDate: number }
    ): Promise<number>;

    // find(accountId: string): Promise<AccountEntity>;

    // update(accountId: string, accountEntity: AccountEntity): Promise<void>;

    // block(): Promise<void>;

    // delete(id: string): Promise<void>;
}

export { TransactionEntityGateway };
