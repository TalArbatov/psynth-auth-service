import { FastifyRequest, FastifyReply } from "fastify";
import { UnauthorizedError } from "../utils/server-error";
import { SESSION_LIFETIME_MS } from "../../app/entities/session-entity";

export const requireAuth = async (req: FastifyRequest, _res: FastifyReply) => {
    const sid = req.cookies?.sid;

    if (!sid) {
        throw new UnauthorizedError();
    }

    const sessionEntityGateway = req.appProfile.getSessionEntityGateway();
    const session = await sessionEntityGateway.findById(sid);

    if (!session || !session.isValid()) {
        throw new UnauthorizedError();
    }

    // Sliding expiry: extend if past half lifetime
    if (session.isPastHalfLifetime()) {
        const newExpiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
        await sessionEntityGateway.extendExpiry(session.getId(), newExpiresAt);
        session.extendExpiry();
    }

    const accountEntityGateway = req.appProfile.getAccountEntityGateway();
    const user = await accountEntityGateway.find(session.getUserId());

    if (!user) {
        throw new UnauthorizedError();
    }

    req.session = session;
    req.user = user;
};
