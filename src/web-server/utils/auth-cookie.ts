import { FastifyRequest } from "fastify";

const parseBooleanEnv = (value: string | undefined): boolean | undefined => {
    if (value === undefined) return undefined;
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
};

const isHttpsRequest = (req: FastifyRequest): boolean => {
    const forwarded = req.headers["x-forwarded-proto"];
    const forwardedProto = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const normalizedForwarded = forwardedProto?.split(",")[0]?.trim().toLowerCase();

    if (normalizedForwarded === "https") return true;

    return req.protocol === "https";
};

export const getAuthCookieOptions = (req: FastifyRequest) => {
    const secureOverride = parseBooleanEnv(process.env.COOKIE_SECURE);
    const secure = secureOverride ?? isHttpsRequest(req);

    return {
        httpOnly: true,
        secure,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    };
};
