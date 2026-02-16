import { FastifyRequest, FastifyReply, RouteGenericInterface } from "fastify";
import { DepositToAccountUseCase } from "../../app/use-cases/deposit-use-case";

interface DepositAccountRoute extends RouteGenericInterface {
    Params: { accountId: string };
    Body: { amount: number };
    Reply: { 204: void };
}

export const depositAccountHandler = async (
    req: FastifyRequest<DepositAccountRoute>,
    res: FastifyReply<DepositAccountRoute>
) => {
    const useCase: DepositToAccountUseCase = req.appProfile.getDepositUseCase();

    await useCase.execute({
        accountId: req.params.accountId,
        amount: req.body.amount,
    });

    return res.code(204).send();
};