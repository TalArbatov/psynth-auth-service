import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: process.env.DOTENV_PATH || ".env" });

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.POSTGRESQL_HOST ?? "localhost",
        port: Number(process.env.POSTGRESQL_PORT ?? 5432),
        user: process.env.POSTGRESQL_USER ?? "postgres",
        password: process.env.POSTGRESQL_PASSWORD ?? "password",
        database: process.env.POSTGRESQL_DATABASE ?? "psynth",
        ssl: false,
    },
});
