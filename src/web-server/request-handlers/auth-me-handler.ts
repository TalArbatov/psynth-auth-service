import { FastifyRequest, FastifyReply } from 'fastify';
import { mapAccountEntityToApiObject } from '../../adapters/mappers/account-entity';

const authMeHandler = async (req: FastifyRequest, res: FastifyReply) => {
    res.code(200).send({ user: mapAccountEntityToApiObject(req.user!) });
};

export { authMeHandler };
