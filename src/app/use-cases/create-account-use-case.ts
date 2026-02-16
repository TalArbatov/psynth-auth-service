import bcrypt from 'bcrypt';
import { AccountEntity } from "../entities/account-entity";
import { AccountEntityGateway } from "../ports/account-entity-gateway";

const SALT_ROUNDS = 10;

type CreateAccountInput = {
    username: string;
    password: string;
    email: string;
    activeFlag?: boolean;
};

class CreateAccountUseCase {
    private readonly accountEntityGateway: AccountEntityGateway;

    constructor(accountEntityGateway: AccountEntityGateway) {
        this.accountEntityGateway = accountEntityGateway;
    }

    async execute(input: CreateAccountInput): Promise<AccountEntity> {
        const { username, password, email, activeFlag = true } = input;

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const accountEntity = new AccountEntity();
        accountEntity.setUsername(username);
        accountEntity.setPasswordHash(passwordHash);
        accountEntity.setEmail(email);
        accountEntity.setActiveFlag(activeFlag);
        accountEntity.setCreatedTimestamp(Date.now());
        accountEntity.setUpdatedTimestamp(Date.now());

        await this.accountEntityGateway.save(accountEntity);

        return accountEntity;
    }
}

export { CreateAccountUseCase, CreateAccountInput };
