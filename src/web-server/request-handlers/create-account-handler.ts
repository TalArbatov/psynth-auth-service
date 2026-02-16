import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { mapAccountEntityToApiObject, AccountApiObject } from '../../adapters/mappers/account-entity';

interface RequestBody {
    username: string;
    password: string;
    email: string;
    activeFlag?: boolean;
}

interface CreateAccountRoute extends RouteGenericInterface {
    Body: RequestBody;
    Reply: {
        201: AccountApiObject
    }
}

const createAccountHandler = async (req: FastifyRequest<CreateAccountRoute>, res: FastifyReply<CreateAccountRoute>) => {
    const { username, password, email, activeFlag } = req.body;

    const createAccountUseCase = req.appProfile.getCreateAccountUseCase();

    const accountEntity = await createAccountUseCase.execute({ username, password, email, activeFlag });

    res.code(201).send(mapAccountEntityToApiObject(accountEntity))
}

export { createAccountHandler }
