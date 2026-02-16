import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { authRegisterHandler } from "../../../src/web-server/request-handlers/auth-register-handler";
import { mapAccountEntityToApiObject } from "../../../src/adapters/mappers/account-entity";
import { AccountEntity } from "../../../src/app/entities/account-entity";
import { SessionEntity } from "../../../src/app/entities/session-entity";

vi.mock("../../../src/adapters/mappers/account-entity", () => {
    return {
        mapAccountEntityToApiObject: vi.fn(),
    };
});

describe("authRegisterHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should create account, create session cookie, and return 201 with user object", async () => {
        const mockAccount = new AccountEntity("account-123");
        const mockSession = new SessionEntity({ accountId: "account-123" });

        const createExecute = vi.fn().mockResolvedValue(mockAccount);
        const loginExecute = vi.fn().mockResolvedValue({ account: mockAccount, session: mockSession });

        const req: any = {
            body: {
                username: "tal",
                email: "tal@example.com",
                password: "plain-password",
            },
            ip: "127.0.0.1",
            headers: { "user-agent": "test-agent" },
            appProfile: {
                getCreateAccountUseCase: () => ({ execute: createExecute }),
                getLoginUseCase: () => ({ execute: loginExecute }),
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

        await authRegisterHandler(req, res);

        expect(createExecute).toHaveBeenCalledWith({
            username: "tal",
            email: "tal@example.com",
            password: "plain-password",
        });
        expect(loginExecute).toHaveBeenCalledWith({
            email: "tal@example.com",
            password: "plain-password",
            ip: "127.0.0.1",
            userAgent: "test-agent",
        });
        expect(res.setCookie).toHaveBeenCalledWith("sid", mockSession.getId(), expect.objectContaining({
            httpOnly: true,
            path: "/",
            sameSite: "lax",
        }));
        expect(res.code).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ user: mapped });
    });

    it("should propagate errors from create account use case", async () => {
        const createExecute = vi.fn().mockRejectedValue(new Error("duplicate user"));
        const loginExecute = vi.fn();

        const req: any = {
            body: {
                username: "tal",
                email: "tal@example.com",
                password: "plain-password",
            },
            ip: "127.0.0.1",
            headers: {},
            appProfile: {
                getCreateAccountUseCase: () => ({ execute: createExecute }),
                getLoginUseCase: () => ({ execute: loginExecute }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
            setCookie: vi.fn(),
        };

        await expect(authRegisterHandler(req, res)).rejects.toThrow("duplicate user");
        expect(loginExecute).not.toHaveBeenCalled();
        expect(res.setCookie).not.toHaveBeenCalled();
    });
});
