import { Config } from "./config";
import { createServer } from "./server";

const main = async () => {
    const port = Config.get('web-server.port') || 80;

    await Config.verifyPostgresConnection();

    const app = await createServer();

    app.listen({
        port,
        host: '0.0.0.0'
    }, () => {
        console.log(`listening on port ${port}`);
    });
};

main().catch((error) => {
    console.error("Fatal startup error:", error);
    process.exit(1);
});
