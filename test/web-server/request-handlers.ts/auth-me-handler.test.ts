import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { authMeHandler } from "../../../src/web-server/request-handlers/auth-me-handler";
import { mapAccountEntityToApiObject } from "../../../src/adapters/mappers/account-entity";
import { AccountEntity } from "../../../src/app/entities/account-entity";
import { SessionEntity } from "../../../src/app/entities/session-entity";

vi.mock("../../../src/adapters/mappers/account-entity", () => {
    return {
        mapAccountEntityToApiObject: vi.fn(),
    };
});

describe("authMeHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should return authenticated: false when no sid cookie", async () => {
        const req: any = {
            cookies: {},
            appProfile: {},
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await authMeHandler(req, res);

        expect(res.code).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ authenticated: false });
    });

    it("should return authenticated: false when session is invalid", async () => {
        const mockSession = new SessionEntity({
            accountId: "account-123",
            revokedAt: new Date(), // revoked = invalid
        });

        const req: any = {
            cookies: { sid: "some-session-id" },
            appProfile: {
                getSessionEntityGateway: () => ({
                    findById: vi.fn().mockResolvedValue(mockSession),
                }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await authMeHandler(req, res);

        expect(res.code).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ authenticated: false });
    });

    it("should return authenticated: true with user when session is valid", async () => {
        const mockUser = new AccountEntity("account-123");
        mockUser.setUsername("tal");
        mockUser.setEmail("tal@example.com");

        const mockSession = new SessionEntity({
            accountId: "account-123",
        });

        const mapped = {
            id: "account-123",
            username: "tal",
            email: "tal@example.com",
            createdAt: 123,
            updatedAt: 123,
        };

        (mapAccountEntityToApiObject as any).mockReturnValue(mapped);

        const req: any = {
            cookies: { sid: "some-session-id" },
            appProfile: {
                getSessionEntityGateway: () => ({
                    findById: vi.fn().mockResolvedValue(mockSession),
                }),
                getAccountEntityGateway: () => ({
                    find: vi.fn().mockResolvedValue(mockUser),
                }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await authMeHandler(req, res);

        expect(mapAccountEntityToApiObject).toHaveBeenCalledWith(mockUser);
        expect(res.code).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ authenticated: true, user: mapped });
    });
});
