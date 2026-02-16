import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { loginHandler } from "../../../src/web-server/request-handlers/login-handler";
import { mapAccountEntityToApiObject } from "../../../src/adapters/mappers/account-entity";
import { AccountEntity } from "../../../src/app/entities/account-entity";
import { SessionEntity } from "../../../src/app/entities/session-entity";
import { InvalidCredentialsError } from "../../../src/app/errors/account-errors";

vi.mock("../../../src/adapters/mappers/account-entity", () => {
    return {
        mapAccountEntityToApiObject: vi.fn(),
    };
});

describe("loginHandler (deprecated)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should call loginUseCase and return 200 with mapped API object", async () => {
        const mockAccount = new AccountEntity();
        const mockSession = new SessionEntity({ userId: mockAccount.getId() });
        const execute = vi.fn().mockResolvedValue({ account: mockAccount, session: mockSession });

        const req: any = {
            body: {
                email: "tal",
                password: "plain-password",
            },
            appProfile: {
                getLoginUseCase: () => ({ execute }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        const mapped = {
            id: "acc-12341234",
            username: "tal",
            email: "tal@example.com",
            createdAt: 123,
            updatedAt: 123,
        };

        (mapAccountEntityToApiObject as any).mockReturnValue(mapped);

        await loginHandler(req, res);

        expect(execute).toHaveBeenCalledWith({
            email: "tal",
            password: "plain-password",
        });
        expect(mapAccountEntityToApiObject).toHaveBeenCalledWith(mockAccount);
        expect(res.code).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ user: mapped });
    });

    it("should propagate InvalidCredentialsError from the use case", async () => {
        const execute = vi.fn().mockRejectedValue(new InvalidCredentialsError());

        const req: any = {
            body: {
                email: "tal",
                password: "wrong-password",
            },
            appProfile: {
                getLoginUseCase: () => ({ execute }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await expect(loginHandler(req, res)).rejects.toBeInstanceOf(InvalidCredentialsError);

        expect(res.code).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
});
