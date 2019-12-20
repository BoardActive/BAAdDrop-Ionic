export class StockModel {
    constructor(
        name?: any,
        email?: any,
        phone?: any,
        dateBorn?: any,
        gender?: any,
        facebookUrl?: any,
        linkedInUrl?: any,
        twitterUrl?: any,
        instagramUrl?: any,
        avatarUrl?: any,
        deviceOS?: any,
        deviceOSVersion?: any,
        deviceType?: any,
        locationPermission?: any,
        notificationPermission?: any,
        deviceToken?: any
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
        this.locationPermission = locationPermission;
        this.notificationPermission = notificationPermission;
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
    public locationPermission: any;
    public notificationPermission: any;
    public deviceToken: any;

    public static empty(): StockModel {
        const myDate: string = new Date().toISOString();
        return new StockModel(
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
            false
        );
    }
    public toDto(): StockDto {
        return {
            name: this.name,
            email: this.name,
            phone: this.name,
            dateBorn: this.name,
            gender: this.name,
            facebookUrl: this.name,
            linkedInUrl: this.name,
            twitterUrl: this.name,
            instagramUrl: this.name,
            avatarUrl: this.name,
            deviceOS: this.name,
            deviceOSVersion: this.name,
            deviceType: this.name,
            locationPermission: this.name,
            notificationPermission: this.name,
            deviceToken: this.name
        };
    }
}

export interface StockDto {
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
    locationPermission: any,
    notificationPermission: any,
    deviceToken: any
}

