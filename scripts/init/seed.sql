DROP TABLE IF EXISTS "loginSessions";
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
    id VARCHAR(16) PRIMARY KEY,
    username VARCHAR(128),
    email VARCHAR(254) UNIQUE,
    password_hash VARCHAR(128),
    active_flag BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "login_sessions" (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(16) NOT NULL REFERENCES accounts(id),
    ip VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP
);
CREATE INDEX idx_login_sessions_user_id ON "loginSessions"(user_id);
