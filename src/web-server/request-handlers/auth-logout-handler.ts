import { FastifyRequest, FastifyReply } from 'fastify';

const authLogoutHandler = async (req: FastifyRequest, res: FastifyReply) => {
    const sid = req.cookies?.sid;

    if (sid) {
        const logoutUseCase = req.appProfile.getLogoutUseCase();
        await logoutUseCase.execute({ sessionId: sid });
    }

    res.clearCookie('sid', { path: '/' });

    res.code(204).send();
};

export { authLogoutHandler };
