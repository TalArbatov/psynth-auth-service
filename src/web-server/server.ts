import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { LocalAppProfile } from "./app-profile/local-app-profile";
import { Config } from "./config";
import { routes } from "./utils/routes";
import * as requestHandlers from "./request-handlers/index";
import { AppProfile } from "./app-profile/app-profile";
import sensible from "@fastify/sensible";
import { errorHandlerPlugin } from "./plugins/error-handler";

const registerRequestHandlers = (app: FastifyInstance) => {
    app.get(routes.heartbeat, (_: FastifyRequest, res: FastifyReply) => { res.send(1) });

    app.post(routes.accounts.create, requestHandlers.createAccountHandler)

    app.post(routes.accounts.block, requestHandlers.blockAccountHandler)

    app.post(routes.accounts.deposit, requestHandlers.depositAccountHandler)

    app.get(routes.accounts.statement, requestHandlers.retrieveAccountStatemenetHandler)

    app.post(routes.accounts.withdraw, requestHandlers.withdrawAccountHandler)

    app.get(routes.accounts.balance, requestHandlers.checkAccountBalanceHandler)
};


const registerAppProfile = (app: FastifyInstance, appProfile: AppProfile): void => {
    app.decorateRequest('appProfile', {
        getter() {
            return appProfile
        }
    })
};

const registerPlugins = async (app: FastifyInstance): Promise<void> => {
    await app.register(sensible)

    await app.register(errorHandlerPlugin)
}

const createServer = async (): Promise<FastifyInstance> => {
    const app = Fastify({ logger: true });

    const config = { pgPool: await Config.getPostgresPool() }

    const appProfile = new LocalAppProfile(config);

    registerAppProfile(app, appProfile)

    registerRequestHandlers(app);

    registerPlugins(app)

    return app;
};

export { createServer };
