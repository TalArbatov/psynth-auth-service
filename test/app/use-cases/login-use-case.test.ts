import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import bcrypt from "bcrypt";
import { LoginUseCase } from "../../../src/app/use-cases/login-use-case";
import { InvalidCredentialsError } from "../../../src/app/errors/account-errors";
import { AccountEntity } from "../../../src/app/entities/account-entity";
import { SessionEntity } from "../../../src/app/entities/session-entity";

vi.mock("bcrypt", () => {
    return {
        default: {
            compare: vi.fn(),
        },
    };
});

vi.mock("crypto", async (importOriginal) => {
    const actual = await importOriginal<typeof import("crypto")>();
    return {
        ...actual,
        default: {
            ...actual,
            randomBytes: vi.fn(() => Buffer.from("a".repeat(32))),
        },
    };
});

const createMockAccount = (): AccountEntity => {
    const account = new AccountEntity("account-123");
    account.setUsername("tal");
    account.setEmail("tal@example.com");
    account.setPasswordHash("$2b$10$hashedpassword");
    account.setActiveFlag(true);
    return account;
};

describe("LoginUseCase", () => {
    let mockAccountGateway: any;
    let mockSessionGateway: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockAccountGateway = {
            save: vi.fn(),
            find: vi.fn(),
            findByUsername: vi.fn(),
            findByEmail: vi.fn(),
            list: vi.fn(),
            update: vi.fn(),
        };
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

    it("should return account and session when credentials are valid", async () => {
        const mockAccount = createMockAccount();
        mockAccountGateway.findByEmail.mockResolvedValue(mockAccount);
        (bcrypt.compare as any).mockResolvedValue(true);

        const useCase = new LoginUseCase(mockAccountGateway, mockSessionGateway);

        const result = await useCase.execute({
            email: "tal@example.com",
            password: "my-secret",
        });

        expect(mockAccountGateway.findByEmail).toHaveBeenCalledWith("tal@example.com");
        expect(bcrypt.compare).toHaveBeenCalledWith("my-secret", "$2b$10$hashedpassword");
        expect(result.account).toBe(mockAccount);
        expect(result.session).toBeInstanceOf(SessionEntity);
        expect(result.session.getAccountId()).toBe("account-123");
        expect(mockSessionGateway.save).toHaveBeenCalledWith(result.session);
    });

    it("should throw InvalidCredentialsError when email is not found", async () => {
        mockAccountGateway.findByEmail.mockResolvedValue(null);

        const useCase = new LoginUseCase(mockAccountGateway, mockSessionGateway);

        await expect(
            useCase.execute({ email: "unknown@example.com", password: "my-secret" })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);

        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(mockSessionGateway.save).not.toHaveBeenCalled();
    });

    it("should throw InvalidCredentialsError when password is wrong", async () => {
        const mockAccount = createMockAccount();
        mockAccountGateway.findByEmail.mockResolvedValue(mockAccount);
        (bcrypt.compare as any).mockResolvedValue(false);

        const useCase = new LoginUseCase(mockAccountGateway, mockSessionGateway);

        await expect(
            useCase.execute({ email: "tal@example.com", password: "wrong-password" })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);

        expect(mockSessionGateway.save).not.toHaveBeenCalled();
    });

    it("should pass ip and userAgent to the session entity", async () => {
        const mockAccount = createMockAccount();
        mockAccountGateway.findByEmail.mockResolvedValue(mockAccount);
        (bcrypt.compare as any).mockResolvedValue(true);

        const useCase = new LoginUseCase(mockAccountGateway, mockSessionGateway);

        const result = await useCase.execute({
            email: "tal@example.com",
            password: "my-secret",
            ip: "127.0.0.1",
            userAgent: "Mozilla/5.0",
        });

        expect(result.session.getIp()).toBe("127.0.0.1");
        expect(result.session.getUserAgent()).toBe("Mozilla/5.0");
    });
});
