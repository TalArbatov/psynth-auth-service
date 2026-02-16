import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mapTransactionEntityToApiObject } from "../../../src/adapters/mappers/transaction-entity";
import { retrieveAccountStatemenetHandler } from "../../../src/web-server/request-handlers/retrieve-account-statement-handler";

// Mock the mapper
vi.mock("../../../src/adapters/mappers/transaction-entity", () => {
    return {
        mapTransactionEntityToApiObject: vi.fn(),
    };
});

describe("retrieveAccountStatemenetHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-01-20T10:00:00.000Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    const buildRes = () =>
        ({
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        }) as any;

    it("should query by date boundary and return mapped transactions (from + to provided)", async () => {
        const accountId = "acc_123";
        const from = "2026-01-01T00:00:00.000Z";
        const to = "2026-01-10T00:00:00.000Z";

        const startDate = new Date(from).getTime();
        const endDate = new Date(to).getTime();

        const tx1 = { id: "t1" };
        const tx2 = { id: "t2" };

        const listByDateBoundary = vi.fn().mockResolvedValue([tx1, tx2]);

        // mapper output
        (mapTransactionEntityToApiObject as any)
            .mockReturnValueOnce({ tx: "mapped1" })
            .mockReturnValueOnce({ tx: "mapped2" });

        const req: any = {
            params: { accountId },
            query: { from, to },
            appProfile: {
                getTransactionEntityGateway: () => ({ listByDateBoundary }),
            },
        };

        const res = buildRes();

        await retrieveAccountStatemenetHandler(req, res);

        expect(listByDateBoundary).toHaveBeenCalledTimes(1);
        expect(listByDateBoundary).toHaveBeenCalledWith(accountId, {
            startDate,
            endDate,
        });

        expect(mapTransactionEntityToApiObject).toHaveBeenCalledTimes(2);
        expect(mapTransactionEntityToApiObject).toHaveBeenNthCalledWith(1, tx1);
        expect(mapTransactionEntityToApiObject).toHaveBeenNthCalledWith(2, tx2);

        expect(res.code).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith([{ tx: "mapped1" }, { tx: "mapped2" }]);
    });

    it("should default startDate=0 and endDate=Date.now() when from/to are missing", async () => {
        const accountId = "acc_default";
        const now = Date.now(); // controlled by fake timers

        const listByDateBoundary = vi.fn().mockResolvedValue([]);

        (mapTransactionEntityToApiObject as any).mockImplementation(() => {
            throw new Error("should not be called");
        });

        const req: any = {
            params: { accountId },
            query: {},
            appProfile: {
                getTransactionEntityGateway: () => ({ listByDateBoundary }),
            },
        };

        const res = buildRes();

        await retrieveAccountStatemenetHandler(req, res);

        expect(listByDateBoundary).toHaveBeenCalledTimes(1);
        expect(listByDateBoundary).toHaveBeenCalledWith(accountId, {
            startDate: 0,
            endDate: now,
        });

        expect(res.code).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith([]);
    });
});
