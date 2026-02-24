#!/usr/bin/env node

if (process.env.DOTENV_PATH) {
    require("dotenv").config({ path: process.env.DOTENV_PATH });
} else {
    require("dotenv/config");
}

const { execFileSync } = require("node:child_process");
const { Client } = require("pg");

const requiredEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const run = async () => {
    const host = requiredEnv("POSTGRESQL_HOST");
    const port = Number(requiredEnv("POSTGRESQL_PORT"));
    const user = requiredEnv("POSTGRESQL_USER");
    const password = requiredEnv("POSTGRESQL_PASSWORD");
    const database = requiredEnv("POSTGRESQL_DATABASE");
    const ssl = process.env.POSTGRESQL_SSL === "true" ? { rejectUnauthorized: false } : false;

    const client = new Client({ host, port, user, password, database, ssl });
    await client.connect();

    try {
        await client.query("BEGIN");
        await client.query("CREATE SCHEMA IF NOT EXISTS drizzle");
        await client.query("DROP TABLE IF EXISTS public.login_sessions CASCADE");
        await client.query("DROP TABLE IF EXISTS public.accounts CASCADE");
        await client.query("DROP TABLE IF EXISTS drizzle.__drizzle_migrations");
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        await client.end();
    }

    execFileSync("npx", ["drizzle-kit", "migrate"], { stdio: "inherit" });
};

run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
