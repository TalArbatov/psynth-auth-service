DROP INDEX IF EXISTS "idx_login_sessions_account_id";
ALTER TABLE "login_sessions" DROP CONSTRAINT IF EXISTS "login_sessions_account_id_accounts_id_fk";
DROP TABLE IF EXISTS "login_sessions";
DROP TABLE IF EXISTS "accounts";
