import "dotenv/config";
import config from "config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import { logger } from "../logger";

const once = <T>(cb: () => T): (() => T) => {
    let t: undefined | T;
    return () => {
        if (!t) t = cb();
        return t;
    };
};

export { once };

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

const Config = {
    get(key: string): any {
        try {
            return config.get(key);
        } catch {
            return undefined;
        }
    },

    getPostgresPool: once((): Pool => {
        const connectionConfig = config.get("postgresql") as Record<string, any>;

        const pool = new Pool({
            ...connectionConfig,
            max: connectionConfig.max ?? 10,
        });

        pool.on("connect", () => {
            logger.info("postgres pool connected");
        });
        pool.on("error", (err) => {
            logger.error({ err }, "unexpected postgres pool error");
        });

        return pool;
    }),

    getDrizzle: once((): DrizzleDB => {
        return drizzle(Config.getPostgresPool(), { schema });
    }),

    verifyPostgresConnection: async (): Promise<void> => {
        const pool = Config.getPostgresPool();
        await pool.query("select 1");
    },

    closePostgresPool: async (): Promise<void> => {
        const pool = Config.getPostgresPool();
        await pool.end();
    },
};

export { Config };
