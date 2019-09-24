import { UUID } from 'angular2-uuid';
import { BaseDatabaseModel, BaseDto } from './base-dto.model';

export class MessageModel extends BaseDatabaseModel {

    constructor(
        id: string, 
        dateCreated: string,
        dateLastUpdated: string,
        messageId: string,
        imageUrl: string,
        isTestMessage: string,
        tap: string,
        body: string,
        title: string,
        notificationId: string,
        messageData: Array<string>
            ) {
        super();
        console.log('in model');
        this.id = id;
        this.dateCreated = dateCreated;
        this.dateLastUpdated = dateLastUpdated;
        this.messageId = messageId;
        this.imageUrl = imageUrl;
        this.isTestMessage = isTestMessage;
        this.tap = tap;
        this.body = body;
        this.title = title;
        this.notificationId = notificationId;
        this.messageData = messageData;
    }
   public dateCreated: string;
   public dateLastUpdated: string;
   public messageId: string;
   public imageUrl: string;
   public isTestMessage: string;
   public tap: string;
   public tag: string;
   public body: string;
   public title: string;
   public notificationId: string;
   public messageData: Array<string>;

    public static empty(): MessageModel {
        return new MessageModel(
            UUID.UUID(),
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
    public toDto(): MessageDto {
        return {
            id: this.id,
            dateCreated: this.dateCreated,
            dateLastUpdated: this.dateLastUpdated,
            messageId: this.messageId,
            imageUrl: this.imageUrl,
            isTestMessage: this.isTestMessage,
            tap: this.tap,
            body: this.body,
            title: this.title,
            notificationId: this.notificationId,
            messageData: this.messageData
        };
    }
}

export interface MessageDto extends BaseDto {
    dateCreated: string,
    dateLastUpdated: string,
    messageId: string,
    imageUrl: string,
    isTestMessage: string,
    tap: string,
    body: string,
    title: string,
    notificationId: string,
    messageData: Array<string>
}

