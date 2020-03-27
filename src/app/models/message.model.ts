export class MessageModel {
    constructor(
        id: number, 
        isTestMessage: any,
        body: any,
        baMessageId: any,
        baNotificationId: any,
        tap: boolean,
        dateCreated: string,
        longitude: any,
        latitude: any,
        firebaseNotificationId: any,
        title: any,
        dateLastUpdated: any,
        imageUrl: any,
        aps: any,
        messageData: any,
        isRead: boolean
    ) {
        console.log('in model');
        this.id = id;
        this.isTestMessage = isTestMessage;
        this.body = body;
        this.baMessageId = baMessageId;
        this.baNotificationId = baNotificationId;
        this.tap = tap;
        this.dateCreated = dateCreated;
        this.longitude = longitude;
        this.latitude = latitude;
        this.firebaseNotificationId = firebaseNotificationId;
        this.title = title;
        this.dateLastUpdated = dateLastUpdated;
        this.imageUrl = imageUrl;
        this.aps = aps;
        this.messageData = messageData;
        this.isRead = isRead;
    }

    public id: number;
    public isTestMessage: any;
    public body: any;
    public baMessageId: any;
    public baNotificationId: any;
    public tap: boolean;
    public dateCreated: any;
    public longitude: any;
    public latitude: any;
    public firebaseNotificationId: any;
    public title: any;
    public dateLastUpdated: any;
    public imageUrl: any;
    public aps: any;
    public messageData: any;
    public isRead: boolean;

    public static empty(): MessageModel {
        const myDate: string = new Date().toISOString();
        return new MessageModel(
            null,
            null,
            null,
            null,
            null,
            null,
            myDate, 
            null,
            null,
            null,
            null,            
            myDate, 
            null, 
            null, 
            null, 
            false
        );
    }
    public toDto(): MessageDto {
        return {
            id: this.id,
            isTestMessage: this.isTestMessage,
            body: this.body,
            baMessageId: this.baMessageId,
            baNotificationId: this.baNotificationId,
            tap: this.tap,
            dateCreated: this.dateCreated,
            longitude: this.longitude,
            latitude: this.latitude,
            firebaseNotificationId: this.firebaseNotificationId,
            title: this.title,
            dateLastUpdated: this.dateLastUpdated,
            imageUrl: this.imageUrl,
            aps: this.aps,
            messageData: this.messageData,
            isRead: this.isRead,
        };
    }
}

export interface MessageDto {
    id: number, 
    isTestMessage: any,
    body: any,
    baMessageId: any,
    baNotificationId: any,
    tap: boolean,
    dateCreated: string,
    longitude: any,
    latitude: any,
    firebaseNotificationId: any,
    title: any,
    dateLastUpdated: any,
    imageUrl: any,
    aps: any,
    messageData: any
    isRead: boolean,
}

