import { AppProfile } from "./src/web-server/app-profile/app-profile";

import "fastify"

declare module "fastify" {
    interface FastifyRequest {
        appProfile: AppProfile
    }
}