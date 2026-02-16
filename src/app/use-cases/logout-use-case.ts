import { SessionEntityGateway } from "../ports/session-entity-gateway";

type LogoutInput = {
    sessionId: string;
};

class LogoutUseCase {
    private readonly sessionEntityGateway: SessionEntityGateway;

    constructor(sessionEntityGateway: SessionEntityGateway) {
        this.sessionEntityGateway = sessionEntityGateway;
    }

    async execute(input: LogoutInput): Promise<void> {
        await this.sessionEntityGateway.revoke(input.sessionId);
    }
}

export { LogoutUseCase, LogoutInput };
