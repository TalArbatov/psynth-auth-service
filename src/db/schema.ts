import { pgTable, varchar, boolean, timestamp, text, jsonb, index } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
    id: varchar("id", { length: 16 }).primaryKey(),
    username: varchar("username", { length: 128 }),
    email: varchar("email", { length: 254 }).unique(),
    passwordHash: varchar("password_hash", { length: 128 }),
    activeFlag: boolean("active_flag"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const loginSessions = pgTable("login_sessions", {
    id: varchar("id", { length: 64 }).primaryKey(),
    accountId: varchar("account_id", { length: 16 }).notNull().references(() => accounts.id),
    ip: varchar("ip", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at"),
}, (table) => ([
    index("idx_login_sessions_account_id").on(table.accountId),
]));

