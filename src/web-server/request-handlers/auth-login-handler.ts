import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { mapAccountEntityToApiObject, AccountApiObject } from '../../adapters/mappers/account-entity';

interface RequestBody {
    email: string;
    password: string;
}

interface AuthLoginRoute extends RouteGenericInterface {
    Body: RequestBody;
    Reply: {
        200: { user: AccountApiObject }
    }
}

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

const authLoginHandler = async (req: FastifyRequest<AuthLoginRoute>, res: FastifyReply<AuthLoginRoute>) => {
    const { email, password } = req.body;

    const loginUseCase = req.appProfile.getLoginUseCase();

    const { account, session } = await loginUseCase.execute({
        email,
        password,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
    });

    res.setCookie('sid', session.getId(), COOKIE_OPTIONS);

    console.log('-------------')
    console.log(account)

    res.code(200).send({ user: mapAccountEntityToApiObject(account) });
};

export { authLoginHandler };
