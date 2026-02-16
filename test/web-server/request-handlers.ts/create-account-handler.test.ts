import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { createAccountHandler } from "../../../src/web-server/request-handlers/create-account-handler";
import { mapAccountEntityToApiObject } from "../../../src/adapters/mappers/account-entity";
import { AccountEntity } from "../../../src/app/entities/account-entity";

vi.mock("../../../src/adapters/mappers/account-entity", () => {
    return {
        mapAccountEntityToApiObject: vi.fn(),
    };
});

describe("createAccountHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should call createAccountUseCase and return 201 with mapped API object", async () => {
        const mockEntity = new AccountEntity();
        const execute = vi.fn().mockResolvedValue(mockEntity);

        const req: any = {
            body: {
                username: "tal",
                password: "plain-password",
                email: "tal@example.com",
                activeFlag: false,
            },
            appProfile: {
                getCreateAccountUseCase: () => ({ execute }),
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

        await createAccountHandler(req, res);

        expect(execute).toHaveBeenCalledWith({
            username: "tal",
            password: "plain-password",
            email: "tal@example.com",
            activeFlag: false,
        });
        expect(mapAccountEntityToApiObject).toHaveBeenCalledWith(mockEntity);
        expect(res.code).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(mapped);
    });

    it("should pass undefined activeFlag when not provided", async () => {
        const mockEntity = new AccountEntity();
        const execute = vi.fn().mockResolvedValue(mockEntity);

        const req: any = {
            body: {
                username: "tal",
                password: "plain-password",
                email: "tal@example.com",
            },
            appProfile: {
                getCreateAccountUseCase: () => ({ execute }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        (mapAccountEntityToApiObject as any).mockReturnValue({});

        await createAccountHandler(req, res);

        expect(execute).toHaveBeenCalledWith({
            username: "tal",
            password: "plain-password",
            email: "tal@example.com",
            activeFlag: undefined,
        });
    });

    it("should propagate errors from the use case", async () => {
        const execute = vi.fn().mockRejectedValue(new Error("DB down"));

        const req: any = {
            body: {
                username: "tal",
                password: "plain-password",
                email: "tal@example.com",
            },
            appProfile: {
                getCreateAccountUseCase: () => ({ execute }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await expect(createAccountHandler(req, res)).rejects.toThrow("DB down");

        expect(res.code).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
});
