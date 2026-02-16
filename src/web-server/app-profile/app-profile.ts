import { AccountEntityGateway } from "../../app/ports/account-entity-gateway";
import { SessionEntityGateway } from "../../app/ports/session-entity-gateway";
import { DrizzleDB } from "../config";
import { AccountPostgresEntityGateway } from "../../adapters/postgres-gateways/account-postgres-entity-gateway";
import { SessionPostgresEntityGateway } from "../../adapters/postgres-gateways/session-postgres-entity-gateway";
import { CreateAccountUseCase } from "../../app/use-cases/create-account-use-case";
import { LoginUseCase } from "../../app/use-cases/login-use-case";
import { LogoutUseCase } from "../../app/use-cases/logout-use-case";

type Config = {
    db: DrizzleDB;
};

abstract class AppProfile {
    private readonly db: DrizzleDB;

    public constructor(config: Config) {
        this.db = config.db;
    }

    public getAccountEntityGateway(): AccountEntityGateway {
        return new AccountPostgresEntityGateway(this.db);
    }

    public getSessionEntityGateway(): SessionEntityGateway {
        return new SessionPostgresEntityGateway(this.db);
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
