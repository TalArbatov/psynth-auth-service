import { SessionEntityType } from '../../types';
import { SessionEntityGateway } from "../../app/ports/session-entity-gateway";
import { PostgresqlDB } from "../../data-persistence/postgresql";
import { SessionEntity } from "../../app/entities/session-entity";

const mapRowToEntity = (row: SessionEntityType): SessionEntity => {
    return new SessionEntity({
        id: row.id,
        userId: row.user_id,
        ip: row.ip,
        userAgent: row.user_agent,
        createdAt: new Date(row.created_at),
        expiresAt: new Date(row.expires_at),
        revokedAt: row.revoked_at ? new Date(row.revoked_at) : null,
    });
};

const mapEntityToRow = (session: SessionEntity): SessionEntityType => {
    return {
        id: session.getId(),
        user_id: session.getUserId(),
        ip: session.getIp(),
        user_agent: session.getUserAgent(),
        created_at: session.getCreatedAt().toISOString(),
        expires_at: session.getExpiresAt().toISOString(),
        revoked_at: session.getRevokedAt()?.toISOString() ?? null,
    };
};

class SessionPostgresEntityGateway implements SessionEntityGateway {
    private readonly db: PostgresqlDB<SessionEntityType>;

    public constructor(db: PostgresqlDB<SessionEntityType>) {
        this.db = db;
    }

    async save(session: SessionEntity): Promise<void> {
        await this.db.create(mapEntityToRow(session));
    }

    async findById(id: string): Promise<SessionEntity | null> {
        const result = await this.db.find(id);

        if (result)
            return mapRowToEntity(result);
        else
            return null;
    }

    async revoke(id: string): Promise<void> {
        await this.db.query(
            'UPDATE sessions SET revoked_at = NOW() WHERE id = $1',
            [id]
        );
    }

    async extendExpiry(id: string, newExpiresAt: Date): Promise<void> {
        await this.db.query(
            'UPDATE sessions SET expires_at = $1 WHERE id = $2',
            [newExpiresAt.toISOString(), id]
        );
    }
}

export { SessionPostgresEntityGateway };
