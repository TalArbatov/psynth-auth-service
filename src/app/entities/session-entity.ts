import crypto from 'crypto';

const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

class SessionEntity {
    private readonly id: string;
    private readonly userId: string;
    private readonly ip: string | null;
    private readonly userAgent: string | null;
    private readonly createdAt: Date;
    private expiresAt: Date;
    private revokedAt: Date | null;

    public constructor(opts: {
        id?: string;
        userId: string;
        ip?: string | null;
        userAgent?: string | null;
        createdAt?: Date;
        expiresAt?: Date;
        revokedAt?: Date | null;
    }) {
        this.id = opts.id ?? crypto.randomBytes(32).toString('hex');
        this.userId = opts.userId;
        this.ip = opts.ip ?? null;
        this.userAgent = opts.userAgent ?? null;
        this.createdAt = opts.createdAt ?? new Date();
        this.expiresAt = opts.expiresAt ?? new Date(Date.now() + SESSION_LIFETIME_MS);
        this.revokedAt = opts.revokedAt ?? null;
    }

    public getId(): string {
        return this.id;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getIp(): string | null {
        return this.ip;
    }

    public getUserAgent(): string | null {
        return this.userAgent;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getExpiresAt(): Date {
        return this.expiresAt;
    }

    public getRevokedAt(): Date | null {
        return this.revokedAt;
    }

    public isValid(): boolean {
        return this.revokedAt === null && this.expiresAt > new Date();
    }

    public revoke(): void {
        this.revokedAt = new Date();
    }

    public extendExpiry(ms: number = SESSION_LIFETIME_MS): void {
        this.expiresAt = new Date(Date.now() + ms);
    }

    public isPastHalfLifetime(): boolean {
        const totalLifetime = this.expiresAt.getTime() - this.createdAt.getTime();
        const elapsed = Date.now() - this.createdAt.getTime();
        return elapsed > totalLifetime / 2;
    }
}

export { SessionEntity, SESSION_LIFETIME_MS };
