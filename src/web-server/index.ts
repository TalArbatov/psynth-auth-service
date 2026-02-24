import { Config } from "./config";
import { createServer } from "./server";
import { logger } from "../logger";

const main = async () => {
    const port = Config.get('web-server.port') || 80;

    await Config.verifyPostgresConnection();

    const app = await createServer();

    await app.listen({ port, host: '0.0.0.0' });

    logger.info({ port }, "listening");
};

main().catch((error) => {
    logger.fatal({ err: error }, "fatal startup error");
    process.exit(1);
});
