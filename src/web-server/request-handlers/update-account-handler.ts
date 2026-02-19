import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { mapAccountEntityToApiObject, AccountApiObject } from '../../adapters/mappers/account-entity';

interface RequestBody {
    username?: string;
    email?: string;
}

interface UpdateAccountRoute extends RouteGenericInterface {
    Body: RequestBody;
    Reply: {
        200: { user: AccountApiObject }
    }
}

const updateAccountHandler = async (req: FastifyRequest<UpdateAccountRoute>, res: FastifyReply) => {
    const { username, email } = req.body;
    const account = req.user!;
    const accountEntityGateway = req.appProfile.getAccountEntityGateway();

    if (username) account.setUsername(username);
    if (email) account.setEmail(email);
    account.setUpdatedTimestamp(Date.now());

    await accountEntityGateway.update(account.getId(), account);

    res.code(200).send({ user: mapAccountEntityToApiObject(account) });
};

export { updateAccountHandler };
