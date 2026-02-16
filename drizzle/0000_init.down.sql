DROP INDEX IF EXISTS "idx_login_sessions_user_id";
ALTER TABLE "presets" DROP CONSTRAINT IF EXISTS "presets_account_id_accounts_id_fk";
ALTER TABLE "login_sessions" DROP CONSTRAINT IF EXISTS "login_sessions_user_id_accounts_id_fk";
DROP TABLE IF EXISTS "presets";
DROP TABLE IF EXISTS "login_sessions";
DROP TABLE IF EXISTS "accounts";
