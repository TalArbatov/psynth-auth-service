// import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

// const LOCALHOST_ORIGIN_REGEX = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

// const isAllowedOrigin = (origin?: string): boolean => {
//     if (!origin) return false;
//     return LOCALHOST_ORIGIN_REGEX.test(origin);
// };

// export async function corsPlugin(app: FastifyInstance) {
//     app.addHook("onRequest", async (req: FastifyRequest, res: FastifyReply) => {
//         const origin = req.headers.origin;

//         if (isAllowedOrigin(origin)) {
//             res.header("Access-Control-Allow-Origin", origin as string);
//             res.header("Access-Control-Allow-Credentials", "true");
//             res.header("Vary", "Origin");
//         }

//         res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
//         res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

//         if (req.method === "OPTIONS") {
//             return res.code(204).send();
//         }
//     });
// }
