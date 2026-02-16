import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import bcrypt from "bcrypt";
import { CreateAccountUseCase } from "../../../src/app/use-cases/create-account-use-case";

vi.mock("bcrypt", () => {
    return {
        default: {
            hash: vi.fn().mockResolvedValue("$2b$10$hashedpassword"),
        },
    };
});

describe("CreateAccountUseCase", () => {
    let mockGateway: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockGateway = {
            save: vi.fn().mockResolvedValue(undefined),
            find: vi.fn(),
            findByUsername: vi.fn(),
            list: vi.fn(),
            update: vi.fn(),
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should hash the password and save the account entity", async () => {
        const useCase = new CreateAccountUseCase(mockGateway);

        const result = await useCase.execute({
            username: "tal",
            password: "my-secret",
            email: "tal@example.com",
        });

        expect(bcrypt.hash).toHaveBeenCalledWith("my-secret", 10);
        expect(result.getUsername()).toBe("tal");
        expect(result.getEmail()).toBe("tal@example.com");
        expect(result.getPasswordHash()).toBe("$2b$10$hashedpassword");
        expect(result.isActive()).toBe(true);
        expect(mockGateway.save).toHaveBeenCalledTimes(1);
        expect(mockGateway.save).toHaveBeenCalledWith(result);
    });

    it("should set activeFlag to false when provided", async () => {
        const useCase = new CreateAccountUseCase(mockGateway);

        const result = await useCase.execute({
            username: "tal",
            password: "my-secret",
            email: "tal@example.com",
            activeFlag: false,
        });

        expect(result.isActive()).toBe(false);
    });

    it("should set created and updated timestamps", async () => {
        const useCase = new CreateAccountUseCase(mockGateway);
        const before = Date.now();

        const result = await useCase.execute({
            username: "tal",
            password: "my-secret",
            email: "tal@example.com",
        });

        const after = Date.now();
        expect(result.getCreatedTimestamp()).toBeGreaterThanOrEqual(before);
        expect(result.getCreatedTimestamp()).toBeLessThanOrEqual(after);
        expect(result.getUpdatedTimestamp()).toBeGreaterThanOrEqual(before);
        expect(result.getUpdatedTimestamp()).toBeLessThanOrEqual(after);
    });

    it("should propagate gateway errors", async () => {
        mockGateway.save.mockRejectedValue(new Error("DB error"));
        const useCase = new CreateAccountUseCase(mockGateway);

        await expect(
            useCase.execute({
                username: "tal",
                password: "my-secret",
                email: "tal@example.com",
            })
        ).rejects.toThrow("DB error");
    });
});
