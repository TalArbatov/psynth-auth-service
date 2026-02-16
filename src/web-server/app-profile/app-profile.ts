import { AccountEntityGateway } from "../../app/ports/account-entity-gateway";
import { SessionEntityGateway } from "../../app/ports/session-entity-gateway";
import { PostgresqlDB } from "../../data-persistence/postgresql";
import { Pool } from 'pg';
import { AccountEntityType, SessionEntityType } from "../../types";
import { AccountPostgresEntityGateway } from "../../adapters/postgres-gateways/account-postgres-entity-gateway";
import { SessionPostgresEntityGateway } from "../../adapters/postgres-gateways/session-postgres-entity-gateway";
import { CreateAccountUseCase } from "../../app/use-cases/create-account-use-case";
import { LoginUseCase } from "../../app/use-cases/login-use-case";
import { LogoutUseCase } from "../../app/use-cases/logout-use-case";

type Config = {
    pgPool: Pool;
};

abstract class AppProfile {
    private readonly pgPool: Pool;

    public constructor(config: Config) {
        this.pgPool = config.pgPool;
    }

    public getAccountEntityGateway(): AccountEntityGateway {
        const postgresqlDb = new PostgresqlDB<AccountEntityType>(this.pgPool, "accounts")

        return new AccountPostgresEntityGateway(postgresqlDb);
    }

    public getSessionEntityGateway(): SessionEntityGateway {
        const postgresqlDb = new PostgresqlDB<SessionEntityType>(this.pgPool, "sessions")

        return new SessionPostgresEntityGateway(postgresqlDb);
    }

    public getCreateAccountUseCase(): CreateAccountUseCase {
        return new CreateAccountUseCase(this.getAccountEntityGateway());
    }

    public getLoginUseCase(): LoginUseCase {
        return new LoginUseCase(this.getAccountEntityGateway(), this.getSessionEntityGateway());
    }

    public getLogoutUseCase(): LogoutUseCase {
        return new LogoutUseCase(this.getSessionEntityGateway());
    }
}

export { AppProfile };
