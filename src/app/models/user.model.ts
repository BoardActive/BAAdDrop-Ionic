export class UserModel {
    
    constructor(
        id?: string, 
        invitedBy?: Array<any>,
        app?: Array<any>,
        guid?: string,
        userIdToken?: string,
        email?: string, 
        password?: string,
        isGod?: boolean,
        role?: string,
        firstName?: string,
        lastName?: string,
        isApprovedByDoug?: boolean,
        isRejectedByDoug?: boolean,
        isCompliant?: boolean,
        isVerified?: boolean,
        isClaimed?: boolean,
        hasPassword?: boolean,
        avatarUrl?: string,
        googleAvatarUrl?: string,
        inbox?: Array<any>,
        dateCreated?: string,
        dateLastUpdated?: string,
        dateDeleted?: string,
        ) {
        this.id = id;
        this.invitedBy = invitedBy;
        this.app = app;
        this.guid = guid;
        this.guid = guid;
        this.userIdToken = userIdToken;
        this.email = email;
        this.password = password;
        this.isGod = isGod;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isApprovedByDoug = isApprovedByDoug;
        this.isRejectedByDoug = isRejectedByDoug;
        this.isCompliant = isCompliant;
        this.isVerified = isVerified;
        this.isClaimed = isClaimed;
        this.hasPassword = hasPassword;
        this.avatarUrl = avatarUrl;
        this.googleAvatarUrl = googleAvatarUrl;
        this.inbox = inbox;
        this.dateCreated = dateCreated;
        this.dateLastUpdated = dateLastUpdated;
        this.dateDeleted = dateDeleted;
    }
    public id?: string;
    public invitedBy?: Array<any>;
    public app?: Array<any>;
    public guid?: string;
    public userIdToken?: string;
    public email?: string;
    public password?: string;
    public isGod?: boolean;
    public role?: string;
    public firstName?: string;
    public lastName?: string;
    public isApprovedByDoug?: boolean;
    public isRejectedByDoug?: boolean;
    public isCompliant?: boolean;
    public isVerified?: boolean;
    public isClaimed?: boolean;
    public hasPassword?: boolean;
    public avatarUrl?: string;
    public googleAvatarUrl?: string;
    public inbox?: Array<any>;
    public dateCreated?: string;
    public dateLastUpdated?: string;
    public dateDeleted?: string;

    public static fromDto(user: UserDto): UserModel {
        return new UserModel(
            user.id, 
            user.invitedBy, 
            user.app, 
            user.guid, 
            user.userIdToken, 
            user.email, 
            user.password, 
            user.isGod, 
            user.role, 
            user.firstName, 
            user.lastName, 
            user.isApprovedByDoug, 
            user.isRejectedByDoug, 
            user.isCompliant, 
            user.isVerified, 
            user.isClaimed, 
            user.hasPassword, 
            user.avatarUrl, 
            user.googleAvatarUrl,
            user.inbox,
            user.dateCreated,
            user.dateLastUpdated,
            user.dateDeleted
            );
    }

    public static emptyDto(): UserDto {
        return {
            id: null,
            invitedBy: null,
            app: null,
            guid: null,
            userIdToken: null,
            email: null,
            password: null,
            isGod: false,
            role: null,
            firstName: null,
            lastName: null,
            isApprovedByDoug: false,
            isRejectedByDoug: false,
            isCompliant: false,
            isVerified: false,
            isClaimed: false,
            hasPassword: false,
            avatarUrl: null,
            googleAvatarUrl: null,
            inbox: null,
            dateCreated: null,
            dateLastUpdated: null,
            dateDeleted: null
        }
    }

    public toDto(): UserDto {
        return {
            id: this.id,
            invitedBy: this.invitedBy,
            app: this.app,
            guid: this.guid,
            userIdToken: this.userIdToken,
            email: this.email,
            password: this.password,
            isGod: this.isGod,
            role: this.role,
            firstName: this.firstName,
            lastName: this.lastName,
            isApprovedByDoug: this.isApprovedByDoug,
            isRejectedByDoug: this.isRejectedByDoug,
            isCompliant: this.isCompliant,
            isVerified: this.isVerified,
            isClaimed: this.isClaimed,
            hasPassword: this.hasPassword,
            avatarUrl: this.avatarUrl,
            googleAvatarUrl: this.googleAvatarUrl,
            inbox: this.inbox,
            dateCreated: this.dateCreated,
            dateLastUpdated: this.dateLastUpdated,
            dateDeleted: this.dateDeleted
        };
    }
}

export interface UserDto {
    id?: string;
    invitedBy?: Array<any>;
    app?: Array<any>;
    guid?: string;
    userIdToken?: string;
    email?: string;
    password?: string;
    isGod?: boolean;
    role?: string;
    firstName?: string;
    lastName?: string;
    isApprovedByDoug?: boolean;
    isRejectedByDoug?: boolean;
    isCompliant?: boolean;
    isVerified?: boolean;
    isClaimed?: boolean;
    hasPassword?: boolean;
    avatarUrl?: string;
    googleAvatarUrl?: string;
    inbox?: Array<any>;
    dateCreated?: string;
    dateLastUpdated?: string;
    dateDeleted?: string;
}

export interface InvitedBy {
    id?: string;
    guid: string;
}