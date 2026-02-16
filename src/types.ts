export type ErrorResponse = {
    error: {
        code: string;
        message: string;
        requestId?: string;
        details?: unknown;
    };
};
