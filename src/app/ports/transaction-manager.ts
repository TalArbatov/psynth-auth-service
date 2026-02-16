import { AccountEntityGateway } from "./account-entity-gateway";
import { TransactionEntityGateway } from "./transaction-entity-gateway";

// use-cases can use this like 'run this login in a single transaction' 

export interface UnitOfWork {
    accounts: AccountEntityGateway;
    transactions: TransactionEntityGateway;
}

export interface TransactionManager {
    withTransaction<T>(fn: (uow: UnitOfWork) => Promise<T>): Promise<T>;
}
