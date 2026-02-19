const AccountResponse = {
    type: "object",
    properties: {
        id: { type: "string", example: "account-abc123" },
        username: { type: "string", example: "johndoe" },
        email: { type: "string", format: "email", example: "john@example.com" },
        createdAt: { type: "number", example: 1700000000000 },
        updatedAt: { type: "number", example: 1700000000000 },
    },
    required: ["id", "username", "email", "createdAt", "updatedAt"],
} as const;

const ErrorResponse = {
    type: "object",
    properties: {
        error: {
            type: "object",
            properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string", example: "Request validation failed" },
                requestId: { type: "string" },
                details: {},
            },
            required: ["code", "message"],
        },
    },
    required: ["error"],
} as const;

const UserEnvelope = {
    type: "object",
    properties: { user: AccountResponse },
    required: ["user"],
} as const;

export const routeSchemas = {
    register: {
        tags: ["accounts"],
        summary: "Create a new account",
        description: "Register a new user account and automatically log in. Returns the created account and sets a session cookie.",
        body: {
            type: "object",
            required: ["username", "email", "password"],
            properties: {
                username: { type: "string", example: "johndoe" },
                email: { type: "string", format: "email", example: "john@example.com" },
                password: { type: "string", format: "password", example: "s3cret!" },
            },
        },
        response: {
            201: UserEnvelope,
            400: ErrorResponse,
            409: ErrorResponse,
        },
    },

    accountsMe: {
        tags: ["accounts"],
        summary: "Get current account",
        description: "Returns the authenticated user's account details.",
        security: [{ cookieAuth: [] }],
        response: {
            200: UserEnvelope,
            401: ErrorResponse,
        },
    },

    updateAccount: {
        tags: ["accounts"],
        summary: "Update current account",
        description: "Update the authenticated user's username and/or email.",
        security: [{ cookieAuth: [] }],
        body: {
            type: "object",
            properties: {
                username: { type: "string", example: "newname" },
                email: { type: "string", format: "email", example: "new@example.com" },
            },
        },
        response: {
            200: UserEnvelope,
            401: ErrorResponse,
        },
    },

    login: {
        tags: ["auth"],
        summary: "Log in",
        description: "Authenticate with email and password. Returns the account and sets a session cookie.",
        body: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string", format: "email", example: "john@example.com" },
                password: { type: "string", format: "password", example: "s3cret!" },
            },
        },
        response: {
            200: UserEnvelope,
            401: ErrorResponse,
        },
    },

    logout: {
        tags: ["auth"],
        summary: "Log out",
        description: "Revoke the current session and clear the session cookie.",
        security: [{ cookieAuth: [] }],
        response: {
            204: { type: "null", description: "Logged out successfully" },
            401: ErrorResponse,
        },
    },

    authMe: {
        tags: ["auth"],
        summary: "Check authentication status",
        description: "Returns whether the caller is authenticated and, if so, the associated account.",
        response: {
            200: {
                type: "object",
                oneOf: [
                    {
                        properties: {
                            authenticated: { type: "boolean", enum: [true] },
                            user: AccountResponse,
                        },
                        required: ["authenticated", "user"],
                    },
                    {
                        properties: {
                            authenticated: { type: "boolean", enum: [false] },
                        },
                        required: ["authenticated"],
                    },
                ],
            },
        },
    },
} as const;
