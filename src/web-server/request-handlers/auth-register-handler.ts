import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { mapAccountEntityToApiObject, AccountApiObject } from '../../adapters/mappers/account-entity';

interface RequestBody {
    username: string;
    email: string;
    password: string;
}

interface AuthRegisterRoute extends RouteGenericInterface {
    Body: RequestBody;
    Reply: {
        201: { user: AccountApiObject }
    }
}

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
};

const authRegisterHandler = async (req: FastifyRequest<AuthRegisterRoute>, res: FastifyReply<AuthRegisterRoute>) => {
    const { username, email, password } = req.body;

    const createAccountUseCase = req.appProfile.getCreateAccountUseCase();
    const loginUseCase = req.appProfile.getLoginUseCase();

    const account = await createAccountUseCase.execute({
        username,
        email,
        password,
    });

    const { session } = await loginUseCase.execute({
        email,
        password,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
    });

    res.setCookie('sid', session.getId(), COOKIE_OPTIONS);
    res.code(201).send({ user: mapAccountEntityToApiObject(account) });
};

export { authRegisterHandler };
