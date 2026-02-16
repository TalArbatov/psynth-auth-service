import { describe, it, expect, vi } from "vitest";
import { checkAccountBalanceHandler } from "../../../src/web-server/request-handlers/check-account-balance-handler";
import { NotFoundError } from "../../../src/web-server/utils/server-error";

describe("checkAccountBalanceHandler", () => {
    it("should return 200 with accountId and balance when account exists", async () => {
        const accountId = "acc_123";

        const mockAccountEntity = {
            getBalance: vi.fn().mockReturnValue(750),
        };

        const find = vi.fn().mockResolvedValue(mockAccountEntity);

        const req: any = {
            params: { accountId },
            appProfile: {
                getAccountEntityGateway: () => ({ find }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await checkAccountBalanceHandler(req, res);

        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(accountId);

        expect(res.code).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ accountId, balance: 750 });

        expect(mockAccountEntity.getBalance).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundError when account does not exist", async () => {
        const accountId = "account-3qihtoug4";

        const find = vi.fn().mockResolvedValue(null);

        const req: any = {
            params: { accountId },
            appProfile: {
                getAccountEntityGateway: () => ({ find }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await expect(checkAccountBalanceHandler(req, res)).rejects.toBeInstanceOf(NotFoundError);

        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(accountId);

        expect(res.code).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
});
