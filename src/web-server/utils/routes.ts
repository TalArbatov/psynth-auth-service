const routes = {
    // non-versioned (common for k8s / load balancers)
    health: '/health',

    // versioned API
    api: {
        v1: {
            health: '/api/v1/health',

            // Accounts = identity (register + profile)
            accounts: {
                register: '/api/v1/accounts',     // POST
                me: '/api/v1/accounts/me',        // GET, PATCH (optional)
            },
            // Auth (cookie/session-based)
            auth: {
                login: '/api/v1/auth/login',      // POST
                logout: '/api/v1/auth/logout',    // POST (or DELETE if you prefer)
                me: '/api/v1/auth/me',            // GET (returns current account/session)
            },
        },
    },
};

export { routes }
