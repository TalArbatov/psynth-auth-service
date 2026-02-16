import { FastifyRequest, FastifyReply } from 'fastify';
import { TransactionEntity } from '../../app/entities/transaction-entity';
import { RouteGenericInterface } from 'fastify';
import { NotFoundError } from '../utils/server-error';

interface CheckAccountBalanceRoute extends RouteGenericInterface {
    Params: {
        accountId: string
    }
    Reply: {
        200: { accountId: string, balance: number }
    }
}

const checkAccountBalanceHandler = async (req: FastifyRequest<CheckAccountBalanceRoute>, res: FastifyReply<CheckAccountBalanceRoute>) => {
    const accountEntityGateway = req.appProfile.getAccountEntityGateway();

    const { accountId } = req.params;

    const accountEntity = await accountEntityGateway.find(accountId)

    if (!accountEntity) throw new NotFoundError("Account not found", { accountId })

    res.code(200).send({ accountId, balance: accountEntity.getBalance() })


}

export { checkAccountBalanceHandler }
