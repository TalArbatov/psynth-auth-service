import { FastifyRequest, FastifyReply } from 'fastify';
import { mapAccountEntityToApiObject } from '../../adapters/mappers/account-entity';

const accountsMeHandler = async (req: FastifyRequest, res: FastifyReply) => {
    res.code(200).send({ user: mapAccountEntityToApiObject(req.user!) });
};

export { accountsMeHandler };
