import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { createAccountHandler } from "../../../src/web-server/request-handlers/create-account-handler";
import { GeneralError } from "../../../src/web-server/utils/server-error";

import { mapAccountEntityToApiObject } from "../../../src/adapters/mappers/account-entity";
// Mock the mapper so we can assert it was called correctly and control output
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

    it("should create account, save it, and return 201 with mapped API object", async () => {
        // Arrange
        const save = vi.fn().mockResolvedValue(undefined);

        const req: any = {
            body: {
                personId: "person-12341234",
                dailyWithdrawlLimit: 3000,
                activeFlag: false,
                accountType: 2,
            },
            appProfile: {
                getAccountEntityGateway: () => ({ save }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        const mapped = {
            id: "acc-12341234",
            personId: "person-12341234",
            balance: 0,
            dailyWithdrawlLimit: 3000,
            activeFlag: false,
            accountType: 2,
            createdTimestamp: 123,
        };

        (mapAccountEntityToApiObject as any).mockReturnValue(mapped);

        // Act
        await createAccountHandler(req, res);

        // Assert - gateway called
        expect(save).toHaveBeenCalledTimes(1);

        // Assert - mapper called with the created entity
        expect(mapAccountEntityToApiObject).toHaveBeenCalledTimes(1);
        expect(mapAccountEntityToApiObject).toHaveBeenCalledWith(expect.any(Object));

        // Assert - response
        expect(res.code).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(mapped);
    });

    it("should apply defaults when optional fields are missing", async () => {
        // Arrange
        const save = vi.fn().mockResolvedValue(undefined);

        const req: any = {
            body: {
                personId: "person-12341234",
            },
            appProfile: {
                getAccountEntityGateway: () => ({ save }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        // We want to inspect what the handler put into the entity.
        // We'll implement the mapper mock to read values from the entity instance.
        (mapAccountEntityToApiObject as any).mockImplementation((entity: any) => ({
            personId: entity.getPersonId(),
            balance: entity.getBalance(),
            dailyWithdrawlLimit: entity.getDailyWithdrawlLimit(),
            activeFlag: entity.isActive(),
            accountType: entity.getAccountType(),
            createdTimestamp: entity.getCreatedTimestamp(),
        }));

        // Act
        await createAccountHandler(req, res);

        // Assert
        expect(save).toHaveBeenCalledTimes(1);
        expect(res.code).toHaveBeenCalledWith(201);

        // Check defaults were applied inside the handler
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                personId: "person-12341234",
                balance: 0,
                dailyWithdrawlLimit: 1000, // default
                activeFlag: true,          // default
                accountType: 0,            // default
            })
        );
    });

    it("should throw GeneralError when gateway.save fails", async () => {
        // Arrange
        const save = vi.fn().mockRejectedValue(new Error("DB down"));

        const req: any = {
            body: {
                personId: "person_3",
            },
            appProfile: {
                getAccountEntityGateway: () => ({ save }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        // Act + Assert
        await expect(createAccountHandler(req, res)).rejects.toBeInstanceOf(GeneralError);

        expect(save).toHaveBeenCalledTimes(1);
        expect(res.code).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
});
