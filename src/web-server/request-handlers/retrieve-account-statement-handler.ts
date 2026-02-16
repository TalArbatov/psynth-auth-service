import { FastifyRequest, FastifyReply } from 'fastify';
import { RouteGenericInterface } from 'fastify';
import { mapTransactionEntityToApiObject, TransactionApiObject } from '../../adapters/mappers/transaction-entity';

interface RetrieveAccountStatementRoute extends RouteGenericInterface {
    Params: {
        accountId: string
    }
    Querystring: {
        to?: string;
        from?: string;
    }
    Reply: {
        200: TransactionApiObject[]
    }
}

const retrieveAccountStatemenetHandler = async (
    req: FastifyRequest<RetrieveAccountStatementRoute>,
    res: FastifyReply<RetrieveAccountStatementRoute>,
) => {
    const transactionEntityGateway = req.appProfile.getTransactionEntityGateway();

    const { from, to } = req.query;

    const timeBoundary = {
        startDate: from ? new Date(from).getTime() : 0,
        endDate: to ? new Date(to).getTime() : Date.now()
    }

    const { accountId } = req.params;

    const transactions = await transactionEntityGateway.listByDateBoundary(accountId, timeBoundary);

    res.code(200).send(transactions.map(transaction => mapTransactionEntityToApiObject(transaction)))

}

export { retrieveAccountStatemenetHandler }
