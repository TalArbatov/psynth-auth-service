import { Pool } from "pg";
import { TransactionManager, UnitOfWork } from "../../app/ports/transaction-manager";
import { PostgresqlDB } from "../../data-persistence/postgresql";

import { AccountPostgresEntityGateway } from "../postgres-gateways/account-postgres-entity-gateway";
import { TransactionPostgresEntityGateway } from "../postgres-gateways/transaction-postgres-entity-gateway";

import type { AccountEntityType, TransactionEntityType } from "../../types";

export class PostgresTransactionManager implements TransactionManager {
    constructor(private readonly pool: Pool) { }

    async withTransaction<T>(fn: (uow: UnitOfWork) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();

        try {
            await client.query("BEGIN");

            const accountsDb = new PostgresqlDB<AccountEntityType>(client, "accounts");
            const transactionsDb = new PostgresqlDB<TransactionEntityType>(client, "transactions");

            const uow: UnitOfWork = {
                accounts: new AccountPostgresEntityGateway(accountsDb),
                transactions: new TransactionPostgresEntityGateway(transactionsDb),
            };

            const result = await fn(uow);

            await client.query("COMMIT");
            return result;
        } catch (e) {
            await client.query("ROLLBACK");
            throw e;
        } finally {
            client.release();
        }
    }
}
