import { SessionEntity } from "../entities/session-entity";

interface SessionEntityGateway {
    save(session: SessionEntity): Promise<void>;

    findById(id: string): Promise<SessionEntity | null>;

    revoke(id: string): Promise<void>;

    extendExpiry(id: string, newExpiresAt: Date): Promise<void>;
}

export { SessionEntityGateway };
