import bcrypt from 'bcrypt';
import { AccountEntity } from "../entities/account-entity";
import { SessionEntity } from "../entities/session-entity";
import { AccountEntityGateway } from "../ports/account-entity-gateway";
import { SessionEntityGateway } from "../ports/session-entity-gateway";
import { InvalidCredentialsError } from "../errors/account-errors";

type LoginInput = {
    email: string;
    password: string;
    ip?: string;
    userAgent?: string;
};

type LoginResult = {
    account: AccountEntity;
    session: SessionEntity;
};

class LoginUseCase {
    private readonly accountEntityGateway: AccountEntityGateway;
    private readonly sessionEntityGateway: SessionEntityGateway;

    constructor(accountEntityGateway: AccountEntityGateway, sessionEntityGateway: SessionEntityGateway) {
        this.accountEntityGateway = accountEntityGateway;
        this.sessionEntityGateway = sessionEntityGateway;
    }

    async execute(input: LoginInput): Promise<LoginResult> {
        const { email, password, ip, userAgent } = input;

        const account = await this.accountEntityGateway.findByEmail(email);

        if (!account) {
            throw new InvalidCredentialsError();
        }

        const isPasswordValid = await bcrypt.compare(password, account.getPasswordHash());

        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }

        const session = new SessionEntity({
            userId: account.getId(),
            ip: ip ?? null,
            userAgent: userAgent ?? null,
        });

        await this.sessionEntityGateway.save(session);

        return { account, session };
    }
}

export { LoginUseCase, LoginInput, LoginResult };
