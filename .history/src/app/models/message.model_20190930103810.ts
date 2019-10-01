import { UUID } from 'angular2-uuid';
import { BaseDatabaseModel, BaseDto } from './base-dto.model';

export class MessageModel {
    constructor(
        id: number, 
        isTestMessage: any,
        body: any,
        messageId: any,
        tap: boolean,
        dateCreated: string,
        longitude: any,
        latitude: any,
        notificationId: any,
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
        this.messageId = messageId;
        this.tap = tap;
        this.dateCreated = dateCreated;
        this.longitude = longitude;
        this.latitude = latitude;
        this.notificationId = notificationId;
        this.title = title;
        this.dateLastUpdated = dateLastUpdated;
        this.imageUrl = imageUrl;
        this.aps = aps;
        this.messageData = messageData;
        this.isRead = isRead;
    }

    public id: number
    public isTestMessage: any;
    public body: any;
    public messageId: any;
    public tap: boolean;
    public dateCreated: any;
    public longitude: any;
    public latitude: any;
    public notificationId: any;
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
            messageId: this.messageId,
            tap: this.tap,
            dateCreated: this.dateCreated,
            longitude: this.longitude,
            latitude: this.latitude,
            notificationId: this.notificationId,
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
    messageId: any,
    tap: boolean,
    dateCreated: string,
    longitude: any,
    latitude: any,
    notificationId: any,
    title: any,
    dateLastUpdated: any,
    imageUrl: any,
    aps: any,
    messageData: any
    isRead: boolean,
}

