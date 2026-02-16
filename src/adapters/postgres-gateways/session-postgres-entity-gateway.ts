import { eq, sql } from "drizzle-orm";
import { SessionEntityGateway } from "../../app/ports/session-entity-gateway";
import { SessionEntity } from "../../app/entities/session-entity";
import { loginSessions } from "../../db/schema";
import { DrizzleDB } from "../../web-server/config";

type SessionRow = typeof loginSessions.$inferSelect;

const mapRowToEntity = (row: SessionRow): SessionEntity => {
    return new SessionEntity({
        id: row.id,
        accountId: row.userId,
        ip: row.ip,
        userAgent: row.userAgent,
        createdAt: row.createdAt!,
        expiresAt: row.expiresAt,
        revokedAt: row.revokedAt ?? null,
    });
};

class SessionPostgresEntityGateway implements SessionEntityGateway {
    private readonly db: DrizzleDB;

    public constructor(db: DrizzleDB) {
        this.db = db;
    }

    async save(session: SessionEntity): Promise<void> {
        await this.db.insert(loginSessions).values({
            id: session.getId(),
            userId: session.getAccountId(),
            ip: session.getIp(),
            userAgent: session.getUserAgent(),
            createdAt: session.getCreatedAt(),
            expiresAt: session.getExpiresAt(),
            revokedAt: session.getRevokedAt(),
        });
    }

    async findById(id: string): Promise<SessionEntity | null> {
        const rows = await this.db.select().from(loginSessions).where(eq(loginSessions.id, id));
        return rows.length > 0 ? mapRowToEntity(rows[0]) : null;
    }

    async revoke(id: string): Promise<void> {
        await this.db.update(loginSessions)
            .set({ revokedAt: sql`NOW()` })
            .where(eq(loginSessions.id, id));
    }

    async extendExpiry(id: string, newExpiresAt: Date): Promise<void> {
        await this.db.update(loginSessions)
            .set({ expiresAt: newExpiresAt })
            .where(eq(loginSessions.id, id));
    }
}

export { SessionPostgresEntityGateway };
