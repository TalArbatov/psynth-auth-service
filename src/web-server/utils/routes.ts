const routes = {
    heartbeat: '/heartbeat',
    accounts: {
        create: '/api/accounts',
        deposit: '/api/accounts/:accountId/deposit',
        withdraw: '/api/accounts/:accountId/withdraw',
        block: '/api/accounts/:accountId/block',
        statement: '/api/accounts/:accountId/statement',
    },
    auth: {
        register: '/auth/register',
        login: '/auth/login',
        logout: '/auth/logout',
        me: '/auth/me',
    }
}

export { routes }
