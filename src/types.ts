
export interface Database<T> {
    tableName: string;
    create: (cat: T) => Promise<T>;
    get: () => Promise<T[]>;
    find: (id: string) => Promise<T | null>;
    update: (id: string, row: T) => Promise<void>;
    query: <R>(text: string, params: any[]) => Promise<R[]> // bad practice?
    // delete: (id: string) => Promise<void>;
}

export interface IInMemoryDb<T> extends Database<T> {
    memory: Map<string, T>;
}

export interface IPostgresql<T> extends Database<T> {
    connection: { promise: () => { execute: (query: string) => any } };
}

export type Entity = {
    id: string;
};

// correlates to x entities as they're saved in any data persistance layer
export type AccountEntityType = Entity & {
    username: string;
    email: string;
    password_hash: string;
    active_flag: boolean;
    created_at: string;
    updated_at: string;
};


export type SessionEntityType = Entity & {
    user_id: string;
    ip: string | null;
    user_agent: string | null;
    created_at: string;
    expires_at: string;
    revoked_at: string | null;
};

export type ErrorResponse = {
    error: {
        code: string;
        message: string;
        requestId?: string;
        details?: unknown;
    };
};
