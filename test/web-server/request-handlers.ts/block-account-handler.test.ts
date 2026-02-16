import { describe, it, expect, vi, beforeEach } from "vitest";
import { blockAccountHandler } from '../../../src/web-server/request-handlers/block-account-handler';
import { GeneralError, NotFoundError } from '../../../src/web-server/utils/server-error';

describe("blockAccountHandler", () => {
    const accountId = "account-vN934akF";

    let gateway: {
        find: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
    };

    let accountEntity: {
        blockAccount: ReturnType<typeof vi.fn>;
    };

    let req: any;
    let res: any;

    beforeEach(() => {
        gateway = {
            find: vi.fn(),
            update: vi.fn(),
        };

        accountEntity = {
            blockAccount: vi.fn(),
        };

        req = {
            params: { accountId },
            appProfile: {
                getAccountEntityGateway: () => gateway,
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };
    });

    it("should block account and return 204", async () => {
        gateway.find.mockResolvedValue(accountEntity);
        gateway.update.mockResolvedValue(undefined);

        await blockAccountHandler(req, res);

        expect(gateway.find).toHaveBeenCalledTimes(1);
        expect(gateway.find).toHaveBeenCalledWith(accountId);

        expect(accountEntity.blockAccount).toHaveBeenCalledTimes(1);

        expect(gateway.update).toHaveBeenCalledTimes(1);
        expect(gateway.update).toHaveBeenCalledWith(accountId, accountEntity);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundError if account does not exist", async () => {
        gateway.find.mockResolvedValue(null);

        await expect(blockAccountHandler(req, res)).rejects.toBeInstanceOf(NotFoundError);

        expect(gateway.find).toHaveBeenCalledWith(accountId);
        expect(gateway.update).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("should throw GeneralError if update fails", async () => {
        gateway.find.mockResolvedValue(accountEntity);
        gateway.update.mockRejectedValue(new Error("DB error"));

        await expect(blockAccountHandler(req, res)).rejects.toBeInstanceOf(GeneralError);

        expect(accountEntity.blockAccount).toHaveBeenCalledTimes(1);
        expect(gateway.update).toHaveBeenCalledWith(accountId, accountEntity);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("should still call blockAccount even if update fails", async () => {
        gateway.find.mockResolvedValue(accountEntity);
        gateway.update.mockRejectedValue(new Error("DB error"));

        await expect(blockAccountHandler(req, res)).rejects.toBeInstanceOf(GeneralError);

        expect(accountEntity.blockAccount).toHaveBeenCalledTimes(1);
    });
});
