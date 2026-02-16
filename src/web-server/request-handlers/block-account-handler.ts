import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountEntity } from "../../app/entities/account-entity";
import { GeneralError, NotFoundError } from '../utils/server-error';
import { RouteGenericInterface } from 'fastify';

interface BlockAccountRoute extends RouteGenericInterface {
    Params: {
        accountId: string
    }
    Reply: {
        204: void
    }
}


const blockAccountHandler = async (req: FastifyRequest<BlockAccountRoute>, res: FastifyReply<BlockAccountRoute>) => {
    const accountEntityGateway = req.appProfile.getAccountEntityGateway();

    const { accountId } = req.params;

    const accountEntity = await accountEntityGateway.find(accountId)

    if (!accountEntity) throw new NotFoundError("Account not found", { accountId })

    accountEntity.blockAccount();

    try {
        await accountEntityGateway.update(accountId, accountEntity)
    } catch (e) {
        throw new GeneralError("Error blocking account", { accountId })
    }

    res.status(204).send()

}

export { blockAccountHandler }
