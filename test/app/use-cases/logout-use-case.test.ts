import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LogoutUseCase } from "../../../src/app/use-cases/logout-use-case";

describe("LogoutUseCase", () => {
    let mockSessionGateway: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockSessionGateway = {
            save: vi.fn(),
            findById: vi.fn(),
            revoke: vi.fn(),
            extendExpiry: vi.fn(),
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should revoke the session by its ID", async () => {
        const useCase = new LogoutUseCase(mockSessionGateway);

        await useCase.execute({ sessionId: "abc123" });

        expect(mockSessionGateway.revoke).toHaveBeenCalledWith("abc123");
    });
});
