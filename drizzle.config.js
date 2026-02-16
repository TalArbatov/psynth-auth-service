"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        host: (_a = process.env.PGHOST) !== null && _a !== void 0 ? _a : "localhost",
        port: Number((_b = process.env.PGPORT) !== null && _b !== void 0 ? _b : 5432),
        user: (_c = process.env.PGUSER) !== null && _c !== void 0 ? _c : "postgres",
        password: (_d = process.env.PGPASSWORD) !== null && _d !== void 0 ? _d : "postgres",
        database: (_e = process.env.PGDATABASE) !== null && _e !== void 0 ? _e : "postgres",
    },
});
