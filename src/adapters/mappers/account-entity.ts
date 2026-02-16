import { AccountEntity } from "../../app/entities/account-entity";

export type AccountApiObject = {
    id: string;
    username: string;
    email: string;
    createdAt: number;
    updatedAt: number;
}

const mapAccountEntityToApiObject = (accountEntity: AccountEntity): AccountApiObject => {
    return {
        id: accountEntity.getId(),
        username: accountEntity.getUsername(),
        email: accountEntity.getEmail(),
        createdAt: accountEntity.getCreatedTimestamp(),
        updatedAt: accountEntity.getUpdatedTimestamp(),
    }
}

export { mapAccountEntityToApiObject }
