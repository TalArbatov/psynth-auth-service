#!/usr/bin/env node

require("dotenv/config");

const { execFileSync } = require("node:child_process");
const { Client } = require("pg");

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "db", "psynth-pg"]);

const requiredEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const assertSafeToRun = (host) => {
    // if (process.env.ALLOW_LOCAL_DB_RESET !== "true") {
    //     throw new Error("Refusing to run. Set ALLOW_LOCAL_DB_RESET=true.");
    // }

    // if (process.env.NODE_ENV === "production") {
    //     throw new Error("Refusing to run in production.");
    // }

    // if (!LOCAL_HOSTS.has(host)) {
    //     throw new Error(`Refusing to run against non-local host: ${host}`);
    // }
};

const run = async () => {
    const host = requiredEnv("POSTGRESQL_HOST");
    const port = Number(requiredEnv("POSTGRESQL_PORT"));
    const user = requiredEnv("POSTGRESQL_USER");
    const password = requiredEnv("POSTGRESQL_PASSWORD");
    const database = requiredEnv("POSTGRESQL_DATABASE");

    assertSafeToRun(host);

    const client = new Client({ host, port, user, password, database, ssl: false });
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
