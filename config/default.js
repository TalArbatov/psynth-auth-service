module.exports = {
    postgresql: {
        host: process.env.POSTGRESQL_HOST || "localhost",
        port: process.env.POSTGRESQL_PORT || 5432,
        user: process.env.POSTGRESQL_USER || "postgres",
        database: process.env.POSTGRESQL_DATABASE || "psynth",
        password: process.env.POSTGRESQL_PASSWORD || "password",
    },

    ["web-server"]: {
        port: 3050,
        clientDir: "../client/dist",
    },

    ["project-service"]: {
        baseUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3051",
        cookieName: process.env.AUTH_COOKIE_NAME || "sid",
    },
};
