import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { authMeHandler } from "../../../src/web-server/request-handlers/auth-me-handler";
import { mapAccountEntityToApiObject } from "../../../src/adapters/mappers/account-entity";
import { AccountEntity } from "../../../src/app/entities/account-entity";

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

    it("should return 200 with the current user", async () => {
        const mockUser = new AccountEntity("account-123");
        mockUser.setUsername("tal");
        mockUser.setEmail("tal@example.com");

        const mapped = {
            id: "account-123",
            username: "tal",
            email: "tal@example.com",
            createdAt: 123,
            updatedAt: 123,
        };

        (mapAccountEntityToApiObject as any).mockReturnValue(mapped);

        const req: any = {
            user: mockUser,
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await authMeHandler(req, res);

        expect(mapAccountEntityToApiObject).toHaveBeenCalledWith(mockUser);
        expect(res.code).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ user: mapped });
    });
});
