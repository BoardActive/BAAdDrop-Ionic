export interface AppDto {
    apps:             App[];
    isClaimed:        boolean;
    id:               number;
    guid:             string;
    email:            string;
    firstName:        string;
    lastName:         string;
    avatarUrl:        string;
    avatarImageId:    null;
    googleAvatarUrl:  null;
    customerId:       null;
    isCompliant:      boolean;
    isGod:            boolean;
    isApprovedByDoug: boolean;
    isRejectedByDoug: boolean;
    isVerified:       boolean;
    dateCreated:      Date;
    dateLastUpdated:  Date;
    dateDeleted:      null;
    dateTrashed:      null;
    inbox:            WelcomeInbox;
}

export interface App {
    id:              number;
    name:            string;
    guid:            string;
    iconUrl:         null | string;
    itunesUrl:       null | string;
    playStoreUrl:    null | string;
    dateCreated:     Date;
    dateLastUpdated: Date;
    dateTrashed:     null;
    isTrashed:       boolean;
    createdBy:       AtedBy;
    lastUpdatedBy:   AtedBy;
    users:           User[];
    inbox:           AppInbox;
}

export interface AtedBy {
    id:               number;
    email:            string;
    firstName:        null | string;
    lastName:         null | string;
    avatarUrl:        null | string;
    dateCreated:      Date;
    dateLastUpdated:  Date;
    dateDeleted:      Date | null;
    dateTrashed:      null;
    isTrashed:        boolean;
    isClaimed:        boolean;
    isVerified:       boolean;
    isCompliant:      boolean;
    isApprovedByDoug: boolean;
    isRejectedByDoug: boolean;
    inbox:            CreatedByInbox;
}

export interface CreatedByInbox {
    company?:   Company;
    onboarding: Onboarding;
}

export interface Company {
    url:          string;
    name:         string;
    size:         Size;
    hasRequested: boolean;
    phone?:       string;
    intent?:      string;
}

export enum Size {
    Empty = "",
    The100249 = "100-249",
    The110 = "1-10",
    The1150 = "11-50",
    The250 = "250+",
    The5199 = "51-99",
}

export interface Onboarding {
    initial?: number;
}

export interface AppInbox {
    onboarding: { [key: string]: number };
}

export interface User {
    id:          number;
    email:       string;
    firstName:   null | string;
    lastName:    null | string;
    isTrashed:   boolean;
    isClaimed:   boolean;
    isVerified:  boolean;
    isCompliant: boolean;
    role:        Role;
    inbox:       UserInbox;
}

export interface UserInbox {
}

export enum Role {
    Admin = "admin",
    Member = "member",
    Owner = "owner",
}

export interface WelcomeInbox {
    onboarding: Onboarding;
}