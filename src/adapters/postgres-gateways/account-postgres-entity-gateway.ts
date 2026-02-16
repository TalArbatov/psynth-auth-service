import { AccountEntityType } from '../../types'
import { AccountEntityGateway } from "../../app/ports/account-entity-gateway";
import { PostgresqlDB } from "../../data-persistence/postgresql";
import { AccountEntity } from "../../app/entities/account-entity";

const mapRowToEntry = (value: AccountEntityType): AccountEntity => {
    const {
        id,
        person_id,
        balance,
        daily_withdrawl_limit,
        active_flag,
        account_type,
        created_at
    } = value;

    const accountEntity = new AccountEntity(id);

    accountEntity.setPersonId(person_id);
    accountEntity.setBalance(balance);
    accountEntity.setDailyWithdrawlLimit(daily_withdrawl_limit);
    accountEntity.setActiveFlag(active_flag);
    accountEntity.setAccountType(account_type);
    accountEntity.setCreatedTimestamp(Date.parse(created_at))

    return accountEntity;
};

const mapEntryToRow = (accountEntity: AccountEntity): AccountEntityType => {
    const id = accountEntity.getId();
    const person_id = accountEntity.getPersonId();
    const balance = accountEntity.getBalance();
    const daily_withdrawl_limit = accountEntity.getDailyWithdrawlLimit();
    const active_flag = accountEntity.isActive();
    const account_type = accountEntity.getAccountType();
    const created_at = new Date(accountEntity.getCreatedTimestamp()).toISOString();

    return {
        id,
        person_id,
        balance,
        daily_withdrawl_limit,
        active_flag,
        account_type,
        created_at
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
