const routes = {
    heartbeat: '/heartbeat',
    accounts: {
        create: '/api/accounts',
        balance: '/api/accounts/:accountId/balance',
        deposit: '/api/accounts/:accountId/deposit',
        withdraw: '/api/accounts/:accountId/withdraw',
        block: '/api/accounts/:accountId/block',
        statement: '/api/accounts/:accountId/statement',
    }
}

export { routes }