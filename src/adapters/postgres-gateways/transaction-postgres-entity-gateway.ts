import { TransactionEntityType } from "../../types";
import { TransactionEntityGateway } from "../../app/ports/transaction-entity-gateway";
import { PostgresqlDB } from "../../data-persistence/postgresql";
import { TransactionEntity } from "../../app/entities/transaction-entity";

const mapRowToEntity = (row: TransactionEntityType): TransactionEntity => {
    const entity = new TransactionEntity(row.id);

    entity.setAccountId(row.account_id);
    entity.setAmount(row.amount);
    entity.setCreatedAt(Date.parse(row.created_at));

    return entity;
};

const mapEntityToRow = (entity: TransactionEntity): TransactionEntityType => {
    return {
        id: entity.getId(),
        account_id: entity.getAccountId(),
        amount: entity.getAmount(),
        created_at: new Date(entity.getCreatedAt()).toISOString(),
    };
};

class TransactionPostgresEntityGateway implements TransactionEntityGateway {
    constructor(private readonly db: PostgresqlDB<TransactionEntityType>) { }

    async save(entity: TransactionEntity): Promise<void> {
        await this.db.create(mapEntityToRow(entity));
    }

    async listByAccountId(accountId: string): Promise<TransactionEntity[]> {
        const rows = await this.db.get({ key: "account_id", value: accountId });
        return rows.map(mapRowToEntity);
    }

    async listByDateBoundary(
        accountId: string,
        boundary: { startDate: number; endDate: number }
    ): Promise<TransactionEntity[]> {
        const startDate = new Date(boundary.startDate);
        const endDate = new Date(boundary.endDate);

        const sql = `
      SELECT *
      FROM ${this.db.tableName}
      WHERE account_id = $1
        AND created_at >= $2
        AND created_at < $3
      ORDER BY created_at DESC
    `;

        const rows = await this.db.query<TransactionEntityType>(sql, [
            accountId,
            startDate,
            endDate,
        ]);

        return rows.map(mapRowToEntity);
    }

    async getWithdrawalAmountByDateBoundary(
        accountId: string,
        boundary: { startDate: number; endDate: number }
    ): Promise<number> {
        const startDate = new Date(boundary.startDate);
        const endDate = new Date(boundary.endDate);

        const sql = `
      SELECT COALESCE(SUM(ABS(amount)), 0) AS total
      FROM ${this.db.tableName}
      WHERE account_id = $1
        AND created_at >= $2
        AND created_at < $3
        AND amount < 0
    `;

        const rows = await this.db.query<{ total: string | number }>(sql, [
            accountId,
            startDate,
            endDate,
        ]);

        return Number(rows[0]?.total ?? 0);
    }
}

export { TransactionPostgresEntityGateway };
