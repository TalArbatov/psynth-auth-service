import { AccountEntity } from "../../app/entities/account-entity";

export type AccountApiObject = {
    id: string;
    personId: string;
    balance: number;
    dailyWithdrawlLimit: number;
    accountType: number;
    createdTimestamp: number;
}

const mapAccountEntityToApiObject = (accountEntity: AccountEntity): AccountApiObject => {
    return {
        id: accountEntity.getId(),
        personId: accountEntity.getPersonId(),
        balance: accountEntity.getBalance(),
        dailyWithdrawlLimit: accountEntity.getDailyWithdrawlLimit(),
        accountType: accountEntity.getAccountType(),
        // isActive: accountEntity.isActive()
        createdTimestamp: accountEntity.getCreatedTimestamp()
    }
}

export { mapAccountEntityToApiObject }