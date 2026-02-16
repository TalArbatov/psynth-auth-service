import { AppProfile } from "./src/web-server/app-profile/app-profile";
import { SessionEntity } from "./src/app/entities/session-entity";
import { AccountEntity } from "./src/app/entities/account-entity";

import "fastify"

declare module "fastify" {
    interface FastifyRequest {
        appProfile: AppProfile
        session?: SessionEntity
        user?: AccountEntity
    }
}
