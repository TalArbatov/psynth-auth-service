import { AccountEntityGateway } from "../../app/ports/account-entity-gateway";
import { PostgresqlDB } from "../../data-persistence/postgresql";
import { Client, Pool } from 'pg';
import { AccountEntityType, TransactionEntityType } from "../../types";
import { AccountPostgresEntityGateway } from "../../adapters/postgres-gateways/account-postgres-entity-gateway";
import { TransactionPostgresEntityGateway } from "../../adapters/postgres-gateways/transaction-postgres-entity-gateway";
import { DepositToAccountUseCase } from "../../app/use-cases/deposit-use-case";
import { PostgresTransactionManager } from "../../adapters/transaction-managers/postgres-transaction-manager";
import { TransactionManager } from "../../app/ports/transaction-manager";
import { WithdrawFromAccountUseCase } from "../../app/use-cases/withdraw-use-case";

// TODO: in memory DB
type Config = {
    pgPool: Pool;
};

abstract class AppProfile {
    private readonly pgPool: Pool;
    private readonly txManager: TransactionManager;
    public constructor(config: Config) {
        this.pgPool = config.pgPool;
        this.txManager = new PostgresTransactionManager(config.pgPool)
    }

    public getDepositUseCase(): DepositToAccountUseCase {
        return new DepositToAccountUseCase(this.txManager)
    }

    public getWithdrawUseCase(): WithdrawFromAccountUseCase {
        return new WithdrawFromAccountUseCase(this.txManager)
    }

    public getAccountEntityGateway(): AccountEntityGateway {
        const postgresqlDb = new PostgresqlDB<AccountEntityType>(this.pgPool, "accounts")

        return new AccountPostgresEntityGateway(postgresqlDb);
    }
    public getTransactionEntityGateway(): TransactionPostgresEntityGateway {
        const postgresqlDb = new PostgresqlDB<TransactionEntityType>(this.pgPool, "transactions")

        return new TransactionPostgresEntityGateway(postgresqlDb);
    }
}

export { AppProfile };
