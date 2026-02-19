module.exports = {
    postgresql: {
        host: process.env.POSTGRESQL_HOST || "db",
    },
    ["project-service"]: {
        baseUrl: process.env.AUTH_SERVICE_URL || "http://project-service:3051",
    },
};
