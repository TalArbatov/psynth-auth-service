import { FastifyRequest, FastifyReply } from 'fastify';
import { mapAccountEntityToApiObject } from '../../adapters/mappers/account-entity';

const authMeHandler = async (req: FastifyRequest, res: FastifyReply) => {
    const sid = req.cookies?.sid;

    if (!sid) {
        return res.code(200).send({ authenticated: false });
    }

    const sessionEntityGateway = req.appProfile.getSessionEntityGateway();
    const session = await sessionEntityGateway.findById(sid);

    if (!session || !session.isValid()) {
        return res.code(200).send({ authenticated: false });
    }

    const accountEntityGateway = req.appProfile.getAccountEntityGateway();
    const user = await accountEntityGateway.find(session.getAccountId());

    if (!user) {
        return res.code(200).send({ authenticated: false });
    }

    res.code(200).send({
        authenticated: true,
        user: mapAccountEntityToApiObject(user),
    });
};

export { authMeHandler };
