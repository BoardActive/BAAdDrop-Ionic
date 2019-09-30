export interface UsersDto {
    invitedBy?:       UsersDto;
    app?:             App;
    id:               number;
    email:            string;
    firstName:        null | string;
    lastName:         null | string;
    avatarUrl:        null | string;
    dateCreated:      Date;
    dateLastUpdated?: Date;
    dateDeleted:      null;
    isClaimed?:       boolean;
    isVerified:       boolean;
    isCompliant:      boolean;
    isApprovedByDoug: boolean;
    isRejectedByDoug: boolean;
    inbox:            Inbox;
    guid?:            string;
    dateLastUpdted?:  Date;
    appId?:           number;
}

export interface App {
    id:                  number;
    name:                string;
    iconUrl:             null;
    iconImageId:         null;
    paymentMethodId:     null;
    itunesUrl:           null;
    playStoreUrl:        null;
    guid:                string;
    dateTrialExpires:    Date;
    dateCreated:         Date;
    dateLastUpdated:     Date;
    dateDeleted:         null;
    createdByUserId:     number;
    lastUpdatedByUserId: number;
    inbox:               AppInbox;
}

export interface AppInbox {
    onboarding: PurpleOnboarding;
}

export interface PurpleOnboarding {
    step0: number;
    step1: number;
    step2: number;
    step3: number;
}

export interface Inbox {
    company:    Company;
    onboarding: {};
}

export interface Company {
    url:          string;
    name:         string;
    size:         string;
    phone:        string;
    intent:       string;
    hasRequested: boolean;
}