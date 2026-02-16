import { TransactionEntity } from "../../app/entities/transaction-entity";

export type TransactionApiObject = {
    id: string;
    accountId: string;
    amount: number;
    createdAt: number;
}

const mapTransactionEntityToApiObject = (transactionEntity: TransactionEntity): TransactionApiObject => {
    return {
        id: transactionEntity.getId(),
        accountId: transactionEntity.getAccountId(),
        amount: transactionEntity.getAmount(),
        createdAt: transactionEntity.getCreatedAt(),
    }
}

export { mapTransactionEntityToApiObject }