import { TransactionEntity } from "../entities/transaction-entity";
import { TransactionManager } from "../ports/transaction-manager";
import { ResourceNotFoundError } from "../errors/account-errors"
import { DailyLimitExceededError } from "../errors/transaction-errors";

export class WithdrawFromAccountUseCase {
    constructor(
        private readonly tx: TransactionManager,
        private readonly now: () => number = () => Date.now()
    ) { }

    async execute(input: { accountId: string; amount: number }): Promise<void> {
        const { accountId, amount } = input;
        const nowTs = this.now();
        const boundary = getTodayBoundary(nowTs);

        await this.tx.withTransaction(async ({ accounts, transactions }) => {
            const account = await accounts.find(accountId);
            if (!account) throw new ResourceNotFoundError(accountId);

            const withdrawnToday = await transactions.getWithdrawalAmountByDateBoundary(
                accountId,
                boundary
            );

            const dailyLimit = account.getDailyWithdrawlLimit();
            const remaining = dailyLimit - withdrawnToday;

            if (amount > remaining) {
                throw new DailyLimitExceededError();
            }

            // domain rules (blocked/amount<=0/balance) live inside entity
            account.withdraw(amount);
            await accounts.update(accountId, account);

            const txEntity = new TransactionEntity();
            txEntity.setAccountId(accountId);
            txEntity.setAmount(-amount);
            txEntity.setCreatedAt(nowTs);

            await transactions.save(txEntity);
        });
    }
}

function getTodayBoundary(nowTs: number): { startDate: number; endDate: number } {
    const now = new Date(nowTs);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return {
        startDate: startOfToday.getTime(),
        endDate: startOfTomorrow.getTime(),
    };
}
