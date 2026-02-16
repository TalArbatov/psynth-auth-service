import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { authLoginHandler } from "../../../src/web-server/request-handlers/auth-login-handler";
import { mapAccountEntityToApiObject } from "../../../src/adapters/mappers/account-entity";
import { AccountEntity } from "../../../src/app/entities/account-entity";
import { SessionEntity } from "../../../src/app/entities/session-entity";

vi.mock("../../../src/adapters/mappers/account-entity", () => {
    return {
        mapAccountEntityToApiObject: vi.fn(),
    };
});

describe("authLoginHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should call loginUseCase, set cookie, and return 200 with user object", async () => {
        const mockAccount = new AccountEntity("account-123");
        const mockSession = new SessionEntity({ userId: "account-123" });

        const execute = vi.fn().mockResolvedValue({ account: mockAccount, session: mockSession });

        const req: any = {
            body: {
                email: "tal",
                password: "plain-password",
            },
            ip: "127.0.0.1",
            headers: { "user-agent": "test-agent" },
            appProfile: {
                getLoginUseCase: () => ({ execute }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
            setCookie: vi.fn(),
        };

        const mapped = {
            id: "account-123",
            username: "tal",
            email: "tal@example.com",
            createdAt: 123,
            updatedAt: 123,
        };

        (mapAccountEntityToApiObject as any).mockReturnValue(mapped);

        await authLoginHandler(req, res);

        expect(execute).toHaveBeenCalledWith({
            email: "tal",
            password: "plain-password",
            ip: "127.0.0.1",
            userAgent: "test-agent",
        });
        expect(res.setCookie).toHaveBeenCalledWith("sid", mockSession.getId(), expect.objectContaining({
            httpOnly: true,
            path: "/",
            sameSite: "lax",
        }));
        expect(res.code).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ user: mapped });
    });

    it("should propagate errors from the use case", async () => {
        const execute = vi.fn().mockRejectedValue(new Error("DB down"));

        const req: any = {
            body: {
                email: "tal",
                password: "plain-password",
            },
            ip: "127.0.0.1",
            headers: {},
            appProfile: {
                getLoginUseCase: () => ({ execute }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
            setCookie: vi.fn(),
        };

        await expect(authLoginHandler(req, res)).rejects.toThrow("DB down");

        expect(res.setCookie).not.toHaveBeenCalled();
    });
});
