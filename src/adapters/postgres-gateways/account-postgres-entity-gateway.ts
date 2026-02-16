import { eq } from "drizzle-orm";
import { AccountEntityGateway } from "../../app/ports/account-entity-gateway";
import { AccountEntity } from "../../app/entities/account-entity";
import { accounts } from "../../db/schema";
import { DrizzleDB } from "../../web-server/config";

type AccountRow = typeof accounts.$inferSelect;

const mapRowToEntry = (row: AccountRow): AccountEntity => {
    const accountEntity = new AccountEntity(row.id);

    accountEntity.setUsername(row.username!);
    accountEntity.setEmail(row.email!);
    accountEntity.setPasswordHash(row.passwordHash!);
    accountEntity.setActiveFlag(row.activeFlag!);
    accountEntity.setCreatedTimestamp(row.createdAt!.getTime());
    accountEntity.setUpdatedTimestamp(row.updatedAt!.getTime());

    return accountEntity;
};

class AccountPostgresEntityGateway implements AccountEntityGateway {
    private readonly db: DrizzleDB;

    public constructor(db: DrizzleDB) {
        this.db = db;
    }

    async list(): Promise<AccountEntity[]> {
        const rows = await this.db.select().from(accounts);
        return rows.map(mapRowToEntry);
    }

    async find(accountId: string): Promise<AccountEntity | null> {
        const rows = await this.db.select().from(accounts).where(eq(accounts.id, accountId));
        return rows.length > 0 ? mapRowToEntry(rows[0]) : null;
    }

    async findByUsername(username: string): Promise<AccountEntity | null> {
        const rows = await this.db.select().from(accounts).where(eq(accounts.username, username));
        return rows.length > 0 ? mapRowToEntry(rows[0]) : null;
    }

    async findByEmail(email: string): Promise<AccountEntity | null> {
        const rows = await this.db.select().from(accounts).where(eq(accounts.email, email));
        return rows.length > 0 ? mapRowToEntry(rows[0]) : null;
    }

    async save(accountEntity: AccountEntity): Promise<void> {
        await this.db.insert(accounts).values({
            id: accountEntity.getId(),
            username: accountEntity.getUsername(),
            email: accountEntity.getEmail(),
            passwordHash: accountEntity.getPasswordHash(),
            activeFlag: accountEntity.isActive(),
            createdAt: new Date(accountEntity.getCreatedTimestamp()),
            updatedAt: new Date(accountEntity.getUpdatedTimestamp()),
        });
    }

    async update(accountId: string, accountEntity: AccountEntity): Promise<void> {
        await this.db.update(accounts).set({
            username: accountEntity.getUsername(),
            email: accountEntity.getEmail(),
            passwordHash: accountEntity.getPasswordHash(),
            activeFlag: accountEntity.isActive(),
            updatedAt: new Date(accountEntity.getUpdatedTimestamp()),
        }).where(eq(accounts.id, accountId));
    }
}

export { AccountPostgresEntityGateway };
