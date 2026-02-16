import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { authLogoutHandler } from "../../../src/web-server/request-handlers/auth-logout-handler";

describe("authLogoutHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should revoke session, clear cookie, and return 204", async () => {
        const execute = vi.fn();

        const req: any = {
            cookies: { sid: "session-abc" },
            appProfile: {
                getLogoutUseCase: () => ({ execute }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
            clearCookie: vi.fn(),
        };

        await authLogoutHandler(req, res);

        expect(execute).toHaveBeenCalledWith({ sessionId: "session-abc" });
        expect(res.clearCookie).toHaveBeenCalledWith("sid", { path: "/" });
        expect(res.code).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it("should still clear cookie and return 204 when no sid cookie present", async () => {
        const req: any = {
            cookies: {},
            appProfile: {
                getLogoutUseCase: () => ({ execute: vi.fn() }),
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
            clearCookie: vi.fn(),
        };

        await authLogoutHandler(req, res);

        expect(res.clearCookie).toHaveBeenCalledWith("sid", { path: "/" });
        expect(res.code).toHaveBeenCalledWith(204);
    });
});
