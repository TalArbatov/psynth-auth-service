import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { LocalAppProfile } from "./app-profile/local-app-profile";
import { Config } from "./config";
import { routes } from "./utils/routes";
import * as requestHandlers from "./request-handlers/index";
import { AppProfile } from "./app-profile/app-profile";
import sensible from "@fastify/sensible";
import { errorHandlerPlugin } from "./plugins/error-handler";
import { requireAuth } from "./plugins/require-auth";
import cookie from "@fastify/cookie";


const LOCAL_DEV_ORIGIN_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/;

const allowed = new Set([
    "http://psynth.talarbetov.com",
    "http://talarbetov.com",
    "http://www.talarbetov.com",
]);

const isAllowedOrigin = (origin: string): boolean => {
    if (LOCAL_DEV_ORIGIN_REGEX.test(origin)) return true;
    return allowed.has(origin);
};


const registerRequestHandlers = (app: FastifyInstance) => {
    app.get(routes.heartbeat, (_: FastifyRequest, res: FastifyReply) => { res.send(1) });

    app.post(routes.accounts.create, requestHandlers.createAccountHandler)

    app.post(routes.accounts.block, { preHandler: [requireAuth] }, requestHandlers.blockAccountHandler)

    // Auth routes
    app.post(routes.auth.register, requestHandlers.authRegisterHandler)

    app.post(routes.auth.login, requestHandlers.authLoginHandler)

    app.post(routes.auth.logout, requestHandlers.authLogoutHandler)

    app.get(routes.auth.me, { preHandler: [requireAuth] }, requestHandlers.authMeHandler)
};


const registerAppProfile = (app: FastifyInstance, appProfile: AppProfile): void => {
    app.decorateRequest('appProfile', {
        getter() {
            return appProfile
        }
    })
};

const registerPlugins = async (app: FastifyInstance): Promise<void> => {
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
    const app = Fastify({ logger: true });

    const config = { db: Config.getDrizzle() }

    const appProfile = new LocalAppProfile(config);

    registerAppProfile(app, appProfile)

    await registerPlugins(app)

    registerRequestHandlers(app);

    return app;
};

export { createServer };
