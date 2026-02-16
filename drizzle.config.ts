import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.POSTGRESQL_HOST ?? "localhost",
        port: Number(process.env.POSTGRESQL_PORT ?? 5432),
        user: process.env.POSTGRESQL_USER ?? "postgres",
        password: process.env.POSTGRESQL_PASSWORD ?? "postgres",
        database: process.env.POSTGRESQL_DATABASE ?? "postgres",
        ssl: false,
    },
});
