import { FastifyRequest, FastifyReply, RouteGenericInterface } from "fastify";
import { TransactionEntity } from "../../app/entities/transaction-entity";
import { NotFoundError, ConflictError } from "../utils/server-error";
import { WithdrawFromAccountUseCase } from "../../app/use-cases/withdraw-use-case";
interface WithdrawAccountRoute extends RouteGenericInterface {
    Params: { accountId: string };
    Body: { amount: number };
    Reply: { 204: void };
}

const withdrawAccountHandler = async (
    req: FastifyRequest<WithdrawAccountRoute>,
    res: FastifyReply<WithdrawAccountRoute>
) => {
    const useCase: WithdrawFromAccountUseCase = req.appProfile.getWithdrawUseCase();

    await useCase.execute({
        accountId: req.params.accountId,
        amount: req.body.amount,
    });

    return res.code(204).send();
};

export { withdrawAccountHandler };
