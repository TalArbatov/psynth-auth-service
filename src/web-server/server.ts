import crypto from "node:crypto";
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { LocalAppProfile } from "./app-profile/local-app-profile";
import { Config } from "./config";
import { routes } from "./utils/routes";
import { routeSchemas } from "./utils/schemas";
import * as requestHandlers from "./request-handlers/index";
import { AppProfile } from "./app-profile/app-profile";
import sensible from "@fastify/sensible";
import { errorHandlerPlugin } from "./plugins/error-handler";
import { requireAuth } from "./plugins/require-auth";
import cookie from "@fastify/cookie";
import { loggerOptions } from "../logger";


const LOCAL_DEV_ORIGIN_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/;

const allowed = new Set([
    "https://psynth.talarbetov.com",
    "https://talarbetov.com",
    "https://www.talarbetov.com",
]);

const isAllowedOrigin = (origin: string): boolean => {
    if (LOCAL_DEV_ORIGIN_REGEX.test(origin)) return true;
    return allowed.has(origin);
};


const registerRequestHandlers = (app: FastifyInstance) => {
    // Health
    app.get(routes.health, (_: FastifyRequest, res: FastifyReply) => { res.send(1) });
    app.get(routes.api.v1.health, (_: FastifyRequest, res: FastifyReply) => { res.send(1) });

    // Accounts
    app.post(routes.api.v1.accounts.register, { schema: routeSchemas.register }, requestHandlers.authRegisterHandler)
    app.get(routes.api.v1.accounts.me, { preHandler: [requireAuth], schema: routeSchemas.accountsMe }, requestHandlers.accountsMeHandler)
    app.patch(routes.api.v1.accounts.me, { preHandler: [requireAuth], schema: routeSchemas.updateAccount }, requestHandlers.updateAccountHandler)

    // Auth
    app.post(routes.api.v1.auth.login, { schema: routeSchemas.login }, requestHandlers.authLoginHandler)
    app.post(routes.api.v1.auth.logout, { schema: routeSchemas.logout }, requestHandlers.authLogoutHandler)
    app.get(routes.api.v1.auth.me, { schema: routeSchemas.authMe }, requestHandlers.authMeHandler)
};


const registerAppProfile = (app: FastifyInstance, appProfile: AppProfile): void => {
    app.decorateRequest('appProfile', {
        getter() {
            return appProfile
        }
    })
};

const registerPlugins = async (app: FastifyInstance): Promise<void> => {
    await app.register(swagger, {
        openapi: {
            info: {
                title: "Psynth Identity Service",
                description: "Authentication and identity management API",
                version: "1.0.0",
            },
            tags: [
                { name: "accounts", description: "Account management" },
                { name: "auth", description: "Authentication" },
            ],
            components: {
                securitySchemes: {
                    cookieAuth: {
                        type: "apiKey",
                        in: "cookie",
                        name: "sid",
                    },
                },
            },
        },
    });

    await app.register(swaggerUi, { routePrefix: "/docs" });

    app.addHook("onRequest", async (req: FastifyRequest, reply: FastifyReply) => {
        const origin = req.headers.origin;

        if (origin && isAllowedOrigin(origin)) {
            reply.header("Access-Control-Allow-Origin", origin);
            reply.header("Access-Control-Allow-Credentials", "true");
            reply.header("Vary", "Origin");
        }

        reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        reply.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

        if (req.method === "OPTIONS") {
            reply.code(204).send();
            return;
        }
    });

    await app.register(sensible)

    await app.register(cookie)

    await app.register(errorHandlerPlugin)
}

const createServer = async (): Promise<FastifyInstance> => {
    const app = Fastify({
        logger: loggerOptions,
        disableRequestLogging: true,
        genReqId: (req) =>
            (req.headers["x-request-id"] as string) ?? crypto.randomUUID(),
        ajv: {
            customOptions: { keywords: ["example"] },
        },
    });

    app.addHook("onRequest", async (req) => {
        req.log.debug({ method: req.method, url: req.url }, "request started");
    });

    app.addHook("onResponse", async (req, reply) => {
        req.log.info(
            {
                method: req.method,
                url: req.url,
                statusCode: reply.statusCode,
                responseTimeMs: reply.elapsedTime,
                route: req.routeOptions?.url,
            },
            "request completed",
        );
    });

    const config = { db: Config.getDrizzle() }

    const appProfile = new LocalAppProfile(config);

    registerAppProfile(app, appProfile)

    await registerPlugins(app)

    registerRequestHandlers(app);

    return app;
};

export { createServer };
