\c psynth

DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
    id VARCHAR(16) PRIMARY KEY,
    username VARCHAR(128),
    password_hash VARCHAR(128),
    active_flag BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- INSERT INTO accounts VALUES ('account-ai4fj8aj', 'Tal Arbetov', 0, 2000, TRUE, 0, NOW());
-- INSERT INTO accounts VALUES ('account-nv49u32z', 'person-k6ls84y3', 70, 2000, TRUE, 0, NOW());
