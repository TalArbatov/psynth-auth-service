module.exports = {
    postgresql: {
        host: process.env.POSTGRESQL_HOST,
        port: process.env.POSTGRESQL_PORT,
        user: process.env.POSTGRESQL_USER,
        database: process.env.POSTGRESQL_DATABASE,
        password: process.env.POSTGRESQL_PASSWORD,
    },

    ["web-server"]: {
        port: 3000,
    },
};
