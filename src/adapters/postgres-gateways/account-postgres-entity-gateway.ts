import { AccountEntityType } from '../../types'
import { AccountEntityGateway } from "../../app/ports/account-entity-gateway";
import { PostgresqlDB } from "../../data-persistence/postgresql";
import { AccountEntity } from "../../app/entities/account-entity";

const mapRowToEntry = (value: AccountEntityType): AccountEntity => {
    const {
        id,
        username,
        email,
        password_hash,
        active_flag,
        created_at,
        updated_at
    } = value;

    const accountEntity = new AccountEntity(id);

    accountEntity.setUsername(username);
    accountEntity.setEmail(email);
    accountEntity.setPasswordHash(password_hash);
    accountEntity.setActiveFlag(active_flag);
    accountEntity.setCreatedTimestamp(Date.parse(created_at));
    accountEntity.setUpdatedTimestamp(Date.parse(updated_at));

    return accountEntity;
};

const mapEntryToRow = (accountEntity: AccountEntity): AccountEntityType => {
    const id = accountEntity.getId();
    const username = accountEntity.getUsername();
    const email = accountEntity.getEmail();
    const password_hash = accountEntity.getPasswordHash();
    const active_flag = accountEntity.isActive();
    const created_at = new Date(accountEntity.getCreatedTimestamp()).toISOString();
    const updated_at = new Date(accountEntity.getUpdatedTimestamp()).toISOString();

    return {
        id,
        username,
        email,
        password_hash,
        active_flag,
        created_at,
        updated_at
    }
};

class AccountPostgresEntityGateway implements AccountEntityGateway {
    protected readonly db: PostgresqlDB<AccountEntityType>

    protected readonly tableName: string;

    public constructor(db: PostgresqlDB<AccountEntityType>) {
        this.db = db;
        this.tableName = "accounts"
    }

    async list(): Promise<AccountEntity[]> {
        const result = await this.db.get();

        return result.map(value => mapRowToEntry(value));
    }

    async find(accountId: string): Promise<AccountEntity | null> {
        const result = await this.db.find(accountId);

        if (result)
            return mapRowToEntry(result);
        else
            return null;

    }

    async findByUsername(username: string): Promise<AccountEntity | null> {
        const result = await this.db.get({ key: 'username', value: username });

        if (result.length > 0)
            return mapRowToEntry(result[0]);
        else
            return null;
    }

    async findByEmail(email: string): Promise<AccountEntity | null> {
        const result = await this.db.get({ key: 'email', value: email });

        if (result.length > 0)
            return mapRowToEntry(result[0]);
        else
            return null;
    }

    async save(accountEntity: AccountEntity): Promise<void> {
        await this.db.create(mapEntryToRow(accountEntity));

        return;
    }

    async update(accountId: string, accountEntity: AccountEntity): Promise<void> {
        await this.db.update(accountId, mapEntryToRow(accountEntity));

        return;
    }

    // async delete(entryId: string): Promise<void> {
    //     await this.db.delete(entryId);

    //     return;
    // }
}

export { AccountPostgresEntityGateway };
