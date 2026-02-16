import { AccountEntity } from "../entities/account-entity";

interface AccountEntityGateway {
    save(accountEntity: AccountEntity): Promise<void>;

    list(): Promise<AccountEntity[]>;

    find(accountId: string): Promise<AccountEntity | null>;

    update(accountId: string, accountEntity: AccountEntity): Promise<void>;

    // block(): Promise<void>;

    // delete(id: string): Promise<void>;
}

export { AccountEntityGateway };
