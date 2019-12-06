
export class AttributesModel {
    constructor(
        name: any,
        email: any,
        phone: any,
        dateBorn: any,
        gender: any,
        facebookUrl: any,
        linkedInUrl: any,
        twitterUrl: any,
        instagramUrl: any,
        avatarUrl: any,
        deviceOS: any,
        deviceOSVersion: any,
        deviceType: any,
        dateLocationRequested: any,
        dateNotificationRequested: any,
        locationPermission: any,
        notificationPermission: any,
        demoAppUser: any,
        deviceToken: any
    ) {
        console.log('in model');
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.dateBorn = dateBorn;
        this.gender = gender;
        this.facebookUrl = facebookUrl;
        this.linkedInUrl = linkedInUrl;
        this.twitterUrl = twitterUrl;
        this.instagramUrl = instagramUrl;
        this.avatarUrl = avatarUrl;
        this.deviceOS = deviceOS;
        this.deviceOSVersion = deviceOSVersion;
        this.deviceType = deviceType;
        this.dateLocationRequested = dateLocationRequested;
        this.dateNotificationRequested = dateNotificationRequested;
        this.locationPermission = locationPermission;
        this.notificationPermission = notificationPermission;
        this.demoAppUser = demoAppUser;
        this.deviceToken = deviceToken;
    }

    public name: any;
    public email: any;
    public phone: any;
    public dateBorn: any;
    public gender: any;
    public facebookUrl: any;
    public linkedInUrl: any;
    public twitterUrl: any;
    public instagramUrl: any;
    public avatarUrl: any;
    public deviceOS: any;
    public deviceOSVersion: any;
    public deviceType: any;
    public dateLocationRequested: any;
    public dateNotificationRequested: any;
    public locationPermission: any;
    public notificationPermission: any;
    public demoAppUser: any;
    public deviceToken: any;

    public static empty(): AttributesModel {
        const myDate: string = new Date().toISOString();
        return new AttributesModel(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );
    }
    public toDto(): AttributesDto {
        return {
            name: this.name,
            email: this.email,
            phone: this.phone,
            dateBorn: this.dateBorn,
            gender: this.gender,
            facebookUrl: this.facebookUrl,
            linkedInUrl: this.linkedInUrl,
            twitterUrl: this.twitterUrl,
            instagramUrl: this.instagramUrl,
            avatarUrl: this.avatarUrl,
            deviceOS: this.deviceOS,
            deviceOSVersion: this.deviceOSVersion,
            deviceType: this.deviceType,
            dateLocationRequested: this.dateLocationRequested,
            dateNotificationRequested: this.dateNotificationRequested,
            locationPermission: this.locationPermission,
            notificationPermission: this.notificationPermission,
            demoAppUser: this.demoAppUser,
            deviceToken: this.deviceToken,
        };
    }
}

export interface AttributesDto {
    name: any, 
    email: any, 
    phone: any, 
    dateBorn: any, 
    gender: any, 
    facebookUrl: any, 
    linkedInUrl: any, 
    twitterUrl: any, 
    instagramUrl: any, 
    avatarUrl: any, 
    deviceOS: any, 
    deviceOSVersion: any, 
    deviceType: any, 
    dateLocationRequested: any, 
    dateNotificationRequested: any, 
    locationPermission: any, 
    notificationPermission: any, 
    demoAppUser: any, 
    deviceToken: any
}

