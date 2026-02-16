import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { LocalAppProfile } from "./app-profile/local-app-profile";
import { Config } from "./config";
import { routes } from "./utils/routes";
import * as requestHandlers from "./request-handlers/index";
import { AppProfile } from "./app-profile/app-profile";
import sensible from "@fastify/sensible";
import { errorHandlerPlugin } from "./plugins/error-handler";
import { requireAuth } from "./plugins/require-auth";
import cors from '@fastify/cors'
import cookie from "@fastify/cookie";


const allowed = new Set([
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://psyth.talarbetov.com",
    "http://talarbetov.com",
    "http://www.talarbetov.com",
]);


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
    await app.register(cors, {
        origin: (origin, cb) => {
            // allow non-browser tools (curl/postman) that send no Origin
            if (!origin) return cb(null, true);

            if (allowed.has(origin)) return cb(null, true);

            cb(new Error("Not allowed by CORS"), false);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    await app.register(sensible)

    await app.register(cookie)

    await app.register(errorHandlerPlugin)
}

const createServer = async (): Promise<FastifyInstance> => {
    const app = Fastify({ logger: true });

    const config = { pgPool: Config.getPostgresPool() }

    const appProfile = new LocalAppProfile(config);

    registerAppProfile(app, appProfile)

    await registerPlugins(app)

    registerRequestHandlers(app);

    return app;
};

export { createServer };
