import { TransactionEntity } from "../entities/transaction-entity";
import { TransactionManager } from '../ports/transaction-manager';
import { ResourceNotFoundError } from "../errors/account-errors";

export class DepositToAccountUseCase {
    constructor(
        private readonly tx: TransactionManager,
        private readonly now: () => number = () => Date.now()
    ) { }

    async execute(input: { accountId: string; amount: number }): Promise<void> {
        const { accountId, amount } = input;

        await this.tx.withTransaction(async ({ accounts, transactions }) => {
            const account = await accounts.find(accountId);

            if (!account) throw new ResourceNotFoundError(accountId);

            account.deposit(amount);

            await accounts.update(accountId, account);

            const tx = new TransactionEntity();
            tx.setAccountId(accountId);
            tx.setAmount(amount);
            tx.setCreatedAt(this.now());

            await transactions.save(tx);
        });
    }
}
