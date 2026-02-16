import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { AccountEntity } from "../../app/entities/account-entity";
import { ServerError, GeneralError } from '../utils/server-error';
import { mapAccountEntityToApiObject, AccountApiObject } from '../../adapters/mappers/account-entity';

interface RequestBody {
    personId: string;
    dailyWithdrawlLimit?: number;
    activeFlag?: boolean;
    accountType?: number // TODO
}

interface CreateAccountRoute extends RouteGenericInterface {
    Body: RequestBody;
    Reply: {
        201: AccountApiObject
    }
}

const createAccountHandler = async (req: FastifyRequest<CreateAccountRoute>, res: FastifyReply<CreateAccountRoute>) => {
    const {
        personId,
        dailyWithdrawlLimit = 1000, // rm business logic from handler
        activeFlag = true,
        accountType = 0,
    } = req.body;

    const accountEntityGateway = req.appProfile.getAccountEntityGateway();

    const accountEntity = new AccountEntity();

    // validate accout not existing

    accountEntity.setPersonId(personId);
    accountEntity.setBalance(0)
    accountEntity.setDailyWithdrawlLimit(dailyWithdrawlLimit)
    accountEntity.setAccountType(accountType)
    accountEntity.setActiveFlag(activeFlag)
    accountEntity.setCreatedTimestamp(Date.now())

    try {
        await accountEntityGateway.save(accountEntity)
    } catch (e) {
        throw new GeneralError("Error creating account", { accountEntity })
    }

    // TODO: how to respond

    res.code(201).send(mapAccountEntityToApiObject(accountEntity))

}

export { createAccountHandler }
