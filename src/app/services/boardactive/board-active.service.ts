import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { FCMService } from '../fcm/fcm.service';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import {
    HttpTestingController,
    HttpClientTestingModule
  } from '@angular/common/http/testing';
import { ModalController } from '@ionic/angular';
import { BaMessagePage } from '../../pages/ba/ba-message/ba-message.page';
import { Device } from '@ionic-native/device/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Observable } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { tap } from 'rxjs/operators';

declare var cordova;

export class Attributes {
    name?: any;
    email?: any;
    phone?: any;
    dateBorn?: any;
    gender?: any;
    facebookUrl?: any;
    linkedInUrl?: any;
    twitterUrl?: any;
    instagramUrl?: any;
    avatarUrl?: any;
    deviceOS?: any;
    deviceOSVersion?: any;
    deviceType?: any;
    locationPermission?: any;
    notificationPermission?: any;
    deviceToken?: any;
}

export const Config = {
    API_URL: {
        APP_URL_PROD: 'https://api.boardactive.com/mobile/v1',
        APP_URL_DEV: 'https://springer-api.boardactive.com/mobile/v1',
    },
    APP_KEY: {
        APP_KEY_PROD: 'b70095c6-1169-43d6-a5dd-099877b4acb3',
        APP_KEY_DEV: 'd17f0feb-4f96-4c2a-83fd-fd6302ae3a16',
    }
};

import { MessageDto, MessageModel } from '../../models/message.model';
import { reject } from 'q';

@Injectable({
    providedIn: 'root'
})
export class BoardActiveService {
    // sharedPreferences = window.plugins.SharedPreferences.getInstance('settings')
    public isInit: boolean = false;
    public promotions: any[];

    constructor(
        private platform: Platform,
        private http: HttpClient,
        private fcmProvider: FCMService,
        private device: Device,
        private diagnostic: Diagnostic,
        private modalCtrl: ModalController,
        private appVersion: AppVersion,
        private localNotifications: LocalNotifications,
        private localStorageService: LocalStorageService,
        private events: Events
    ) {


    }

    sharedPreferencesPut(key: any, value: any): Promise<any> {
        // alert(`TEST sharedPreferencesPut`);
        return new Promise((resolve, reject) => {

            this.platform.ready().then(() => {
                var sharedPreferences = (<any>window)["plugins"].SharedPreferences.getInstance("BoardActive")
                var successCallback = function () {
                    console.log(`[BA:BoardActive] sharedPreferencesPut ${key} ${value}`);
                    resolve(key);
                }
                var errorCallback = function (err) {
                    console.error(err)
                    resolve(err);
                }

                sharedPreferences.put(key, value, successCallback, errorCallback);
            });

        });
    }

    sharedPreferencesGet(key: any, defaultValue?: any): Promise<any> {
        // alert(`TEST sharedPreferencesGet`);
        return new Promise((resolve, reject) => {

            this.platform.ready().then(() => {
                var sharedPreferences = (<any>window)["plugins"].SharedPreferences.getInstance("BoardActive")

                var successCallback = function (value) {
                    console.log(`[BA:BoardActive] sharedPreferencesGet ${key} ${value}`);
                    resolve(value);
                }
                var errorCallback = function (err) {
                    console.log(err)
                    resolve(err);
                }

                sharedPreferences.get(key, defaultValue, successCallback, errorCallback);

            });

        });
    }

    /*
     * Initialize Client.
    * Configures FCMProvider
    * Initializes Listener for Notifications from Server
    */
    init(): Promise<any> {
        console.log(`[BA:BaClient] init()`);
        return new Promise((resolve, reject) => {
            this.configureFirebase().subscribe(res => {
                resolve(true);
            });
        });
    }

    /**
     * Configures the Client's Firebase Cloud Messaging notifications
     */
    private configureFirebase(): Observable<any> {
        return new Observable((observer) => {
            this.fcmProvider.getToken().then(token => {
                this.localStorageService.setItem('token', token).subscribe(token => {
                    observer.next(token);
                    observer.complete();
                });
            });

            this.fcmProvider.listenToNotifications().pipe(tap(payload => {
                console.log(`[BA:FCM] : ` + JSON.stringify(payload));
                const myDate: string = new Date().toISOString();
                let thisMsg: MessageDto = MessageModel.empty();
                thisMsg = payload;
                thisMsg.notificationId = payload['gcm.message_id'];
                thisMsg.dateCreated = myDate;
                thisMsg.dateLastUpdated = myDate;
                this.postEvent('received', payload.messageId, payload['gcm.message_id'], payload.isTestMessage);
                this.localStorageService.setItem('msg', thisMsg).subscribe(response => {
                    this.events.publish('notification:receive');
                });
                if (thisMsg.tap) {
                    this.addMessage(thisMsg);
                    console.log(`[BA:TAP] : ` + JSON.stringify(thisMsg));
                    this.localStorageService.setItem('msg', thisMsg).subscribe(response => {
                        this.events.publish('notification:tap');
                    });
                    this.modalMessage(thisMsg);
                } else {
                    this.addMessage(thisMsg);
                    console.log(`[BA:NOT_TAP] : ` + JSON.stringify(thisMsg));
                    this.newLocalNotification(thisMsg, 1);
                    this.localStorageService.setItem('msg', thisMsg).subscribe(response => {
                        this.events.publish('notification:notap');
                    });
                }
            })).subscribe(payload => {
                // console.log(`[BA:FCM] : ` + JSON.stringify(payload));
                // const myDate: string = new Date().toISOString();
                // let thisMsg: MessageDto = MessageModel.empty();
                // thisMsg = payload;
                // thisMsg.notificationId = payload['gcm.message_id'];
                // thisMsg.dateCreated = myDate;
                // thisMsg.dateLastUpdated = myDate;
                // this.postEvent('received', payload.messageId, payload['gcm.message_id'], payload.isTestMessage);
                // this.localStorageService.setItem('msg', thisMsg).subscribe(response => {
                //     this.events.publish('notification:receive');
                // });
                // if (thisMsg.tap) {
                //     this.addMessage(thisMsg);
                //     console.log(`[BA:TAP] : ` + JSON.stringify(thisMsg));
                //     this.localStorageService.setItem('msg', thisMsg).subscribe(response => {
                //         this.events.publish('notification:tap');
                //     });
                //     this.modalMessage(thisMsg);
                // } else {
                //     this.addMessage(thisMsg);
                //     console.log(`[BA:NOT_TAP] : ` + JSON.stringify(thisMsg));
                //     this.newLocalNotification(thisMsg, 1);
                //     this.localStorageService.setItem('msg', thisMsg).subscribe(response => {
                //         this.events.publish('notification:notap');
                //     });
                // }
            }
            );
        });
    }


    /*
    Gets the active Environment's root path
    */

    public getEnvironment(): Observable<any> {
        console.log(`[BA:BaClient] getEnvironment()`);

        return new Observable((observer) => {
            this.localStorageService.getItem('environment').subscribe(env => {
                console.log(`environment: ${env}`);
                switch (env) {
                    case 'prod': {
                        this.localStorageService.setItem('AppKey', Config.APP_KEY.APP_KEY_PROD).subscribe(() => {
                            observer.next(Config.API_URL.APP_URL_PROD);
                            observer.complete();
                        });
                        break;
                    }
                    case 'dev': {
                        this.localStorageService.setItem('AppKey', Config.APP_KEY.APP_KEY_DEV).subscribe(() => {
                            observer.next(Config.API_URL.APP_URL_DEV);
                            observer.complete();
                        });
                        break;
                    }
                    default: {
                        this.localStorageService.setItem('AppKey', Config.APP_KEY.APP_KEY_PROD).subscribe(() => {
                            observer.next(Config.API_URL.APP_URL_PROD);
                            observer.complete();
                        });
                    }
                }
            });

        });
    }

    async modalMessage(message: any) {
        const modal = await this.modalCtrl.create({
            component: BaMessagePage,
            componentProps: { message: message }
        });
        return await modal.present();
    }

    /*
    Refreshes the FCM Token
    */
    public refreshFCMToken(): Promise<any> {
        console.log(`[BA:BaClient] refreshFCMToken()`);

        return new Promise((resolve, reject) => {
            this.fcmProvider.getTokenRefresh().then(token => {
                console.log(`[BA:FCMToken_refresh] : ${token}`);
                resolve(token);
            });
        });
    }

    /*
    Handles a Client's device changing locations
     * @param {string} lat
     * @param {string} lng
     * @return void
     */
    handleLocationUpdate(lat: string, lng: string): void {
        console.log(`[BA:handleLocationUpdate] Lat: ${lat} Lng: ${lng}`);
        this.postLocation(lat, lng).subscribe(response => {

        });
    }

    /********************************************************x*x***************************************
    * START Springer REST API Calls
    * Reads data from config.xml from the target build settings.
    */

    /*
    GET /me
    */
    getMe(): Observable<any> {
        return new Observable((observer) => {
            this.getEnvironment().subscribe(setUrl => {
                const url = setUrl + '/me';
                console.log(`[BA:getMe] url: ${url}`);
                this.generateHeaders().then(httpHeaders => {
                    console.log(`[BA:getMe] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
                    this.http.get(url, { headers: httpHeaders }).subscribe(response => {
                        console.log(`[BA:getMe] RESPONSE: ${JSON.stringify(response, null, 2)}`);
                        observer.next(response);
                        observer.complete();
                    }, err => {
                        console.log(`[BA:getMe] ERROR: ${err}`);
                        observer.next(err);
                        observer.complete();
                    });
                });
            })
        });
    }

    /*
    PUT /me
    */
    postLogin(email: any, password: any): Observable<any> {
        return new Observable((observer) => {
            this.getEnvironment().subscribe(setUrl => {
                const url = setUrl + '/login';
                console.log(`[BA:postLogin] url: ${url}`);

                const body = {
                    email: email,
                    password: password
                };

                this.http.post(url, body, { params: {}, headers: {} }).subscribe((response) => {
                    observer.next(response);
                    observer.complete();
                }, err => {
                    observer.next(err);
                    observer.complete();
                });

            })
        });
    }

    /*
    PUT /me
    */
    putMe(setAttributes?: Attributes): Observable<any> {
        var attributes: Attributes = {};
        if (setAttributes) {
            if (setAttributes.name) { attributes.name = setAttributes.name };
            if (setAttributes.email) { attributes.email = setAttributes.email };
            if (setAttributes.phone) { attributes.phone = setAttributes.phone };
            if (setAttributes.dateBorn) { attributes.dateBorn = setAttributes.dateBorn };
            if (setAttributes.gender) { attributes.gender = setAttributes.gender };
            if (setAttributes.facebookUrl) { attributes.facebookUrl = setAttributes.facebookUrl };
            if (setAttributes.linkedInUrl) { attributes.linkedInUrl = setAttributes.linkedInUrl };
            if (setAttributes.twitterUrl) { attributes.twitterUrl = setAttributes.twitterUrl };
            if (setAttributes.instagramUrl) { attributes.instagramUrl = setAttributes.instagramUrl };
            if (setAttributes.avatarUrl) { attributes.avatarUrl = setAttributes.avatarUrl };
        }

        if (this.platform.is('android') || this.platform.is('ios')) {
            //Set Automatic User Attributes
            attributes.deviceOS = this.device.platform;
            attributes.deviceOSVersion = this.device.version;
            attributes.deviceType = this.device.model;

            this.localStorageService.getItem('token').subscribe(token => {
                attributes.deviceToken = token;
                this.diagnostic.isLocationAuthorized().then(data1 => {
                    attributes.locationPermission = data1;
                    this.diagnostic.isRemoteNotificationsEnabled().then(data2 => {
                        attributes.notificationPermission = data2;
                    });
                });
            });

            console.log(`${JSON.stringify(attributes, null, 2)}`);
        }

        console.log(`attributes: ${JSON.stringify(attributes, null, 2)}`);

        return new Observable((observer) => {
            this.getEnvironment().subscribe(setUrl => {
                const url = setUrl + '/me';
                console.log(`[BA:putMe] url: ${url}`);
                this.localStorageService.getItem('UserEmail').subscribe(email => {
                    const deviceOS = this.device.platform;
                    const deviceOSVersion = this.device.version;

                    const body = {
                        email: email,
                        deviceOS: deviceOS,
                        deviceOSVersion: deviceOSVersion,
                        attributes: {
                            stock: attributes
                        }
                    };

                    console.log(`[BA:putMe] body: ${JSON.stringify(body, null, 2)}`);

                    this.generateHeaders().then(httpHeaders => {
                        console.log(`[BA:putMe] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
                        this.http.put(url, body, { headers: httpHeaders }).subscribe(response => {
                            console.log(`[BA:putMe] RESPONSE: ${JSON.stringify(response, null, 2)}`);
                            observer.next(response);
                            observer.complete();
                        }, err => {
                            console.log(`[BA:putMe] ERROR: ${err}`);
                            observer.next(err);
                            observer.complete();
                        });
                    });
                });
            })
        });
    }

    /*
    POST /me
    */
    postMe(): Observable<any> {
        return new Observable((observer) => {
            this.getEnvironment().subscribe(setUrl => {
                const url = setUrl + '/me';
                console.log(`[BA:postMe] url: ${url}`);
                this.localStorageService.getItem('UserEmail').subscribe(email => {
                    const deviceOS = this.device.platform;
                    const deviceOSVersion = this.device.version;

                    const body = {
                        'email': email,
                        'deviceOS': deviceOS,
                        'deviceOSVersion': deviceOSVersion
                    };
                    console.log(`[BA:postMe] body: ${JSON.stringify(body, null, 2)}`);

                    this.generateHeaders().then(httpHeaders => {
                        console.log(`[BA:postMe] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
                        this.http.post(url, body, { headers: httpHeaders }).subscribe(response => {
                            console.log(`[BA:postMe] RESPONSE: ${JSON.stringify(response, null, 2)}`);
                            observer.next(response);
                            observer.complete();
                        }, err => {
                            console.log(`[BA:postMe] ERROR: ${err}`);
                            observer.next(err);
                            observer.complete();
                        });
                    });
                });
            })
        });
    }

    /*
    POST /locations
    */
    postLocation(latitude: string, longitude: string): Observable<any> {
        console.log(`[BA:postLocation] lat/lng: ${latitude + '' + longitude}`);

        return new Observable((observer) => {
            this.getEnvironment().subscribe(setUrl => {
                const url = setUrl + '/locations';
                console.log(`[BA:postLocation] url: ${url}`);
                const body = {
                    'latitude': latitude,
                    'longitude': longitude,
                    'deviceTime': new Date().toString()
                };

                this.generateHeaders().then(httpHeaders => {
                    console.log(`[BA:postLocation] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
                    this.http.post(url, body, { headers: httpHeaders }).subscribe(response => {
                        console.log(`[BA:postLocation] RESPONSE: ${JSON.stringify(response, null, 2)}`);
                        observer.next(response);
                        observer.complete();
                    }, err => {
                        console.log(`[BA:postLocation] ERROR: ${err}`);
                        observer.next(err);
                        observer.complete();
                    });
                });
            })
        });
    }

    /*
    POST /events
    * @return {!Promise<any>}
    */
    postEvent(name: string, messageId: string, firebaseNotificationId: string, testMsg: string): void {
        this.getEnvironment().subscribe(setUrl => {
            const url = setUrl + '/events';
            console.log(`[BA:postEvent] url: ${url}`);
            const body = {
                'name': name,
                'messageId': messageId,
                'firebaseNotificationId': firebaseNotificationId,
                'isTestMessage': testMsg
            };

            this.generateHeaders().then(httpHeaders => {
                console.log(`[BA:postEvent] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
                this.http.post(url, body, { headers: httpHeaders }).subscribe(response => {
                    console.log(`[BA:postEvent] RESPONSE: ${JSON.stringify(response, null, 2)}`);
                }, err => {
                    console.log(`[BA:postEvent] ERROR: ${err}`);
                });
            });
        })
    }

    /**
     * Initialize Client. Initilaizes in the following order:
     *  1) the Server's AppKey (from Springer)
     *  2) the Server's AppID (from Springer)
     *  3) the Client's AppVersionNumber (config.xml)
     *  4) the Client's DeviceToken (from Firebase settings google-services.json)
     *  5) the Client's DeviceOS Operating System
     *  6) the Client's DeviceOSVersion Operating System Version Number
     *  7) the Client's AppTest
     */

    generateHeaders(
        AppKey?: string,
        AppID?: string,
        AppVersionNumber?: string,
        DeviceToken?: string,
        DeviceOS?: string,
        DeviceOSVersion?: string,
        DeviceType?: string,
        AppTest?: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            const Promise_URL = this.getEnvironment().subscribe(setUrl => {
                this.sharedPreferencesPut('X-BoardActive-App-Url', setUrl).then(_ => {
                    console.log(`[BA:HttpHeaders] X-BoardActive-App-Url: ${setUrl}`);
                });
            });

            const Promise_AppKey = new Promise(resolve => {
                this.localStorageService.getItem('AppKey').subscribe(appKey => {
                    AppKey = AppKey || appKey;
                    console.log(`X-BoardActive-App-Key: ${AppKey}`);
                    this.sharedPreferencesPut('X-BoardActive-App-Key', AppKey).then(_ => {
                        console.log(`[BA:HttpHeaders] X-BoardActive-App-Key: ${AppKey}`);
                        resolve(AppKey);
                    });
                });
            });
            
            const Promise_AppID = new Promise(resolve => {
                this.localStorageService.getItem('AppID').subscribe(appId => {
                    AppID = AppID || appId;
                    console.log(`[BA:HttpHeaders] X-BoardActive-App-Id: ${AppID}`);
                    this.sharedPreferencesPut('X-BoardActive-App-Id', AppID).then(_ => {
                        console.log(`[BA:HttpHeaders] X-BoardActive-App-Id: ${AppID}`);
                        resolve(AppID);
                    });        
                });
            });

            const Promise_AppVersionNumber = this.getAppVersionCode().then(appVerNo => {
                AppVersionNumber = AppVersionNumber || appVerNo;
                console.log(`[BA:HttpHeaders] X-BoardActive-App-Version: ${AppVersionNumber}`);
                this.sharedPreferencesPut('X-BoardActive-App-Version', AppVersionNumber).then(_ => {
                    console.log(`[BA:HttpHeaders] X-BoardActive-App-Version: ${AppVersionNumber}`);
                    return AppVersionNumber;
                });
            }).catch((error) => {
                console.log(`AppVersionNumber_err: ${error}`);
            });

            const Promise_DeviceToken = this.localStorageService.getItem('token').subscribe(token => {
                DeviceToken = DeviceToken || token;
                console.log(`[BA:HttpHeaders] X-BoardActive-App-Token: ${DeviceToken}`);
                this.sharedPreferencesPut('X-BoardActive-Device-Token', DeviceToken).then(_ => {
                    console.log(`[BA:HttpHeaders] X-BoardActive-Device-Token: ${DeviceToken}`);
                    return DeviceToken;
                });
            });

            const Promise_DeviceOS = this.sharedPreferencesPut('X-BoardActive-Device-OS', this.device.platform).then(_ => {
                DeviceOS = this.device.platform;
                console.log(`[BA:HttpHeaders] X-BoardActive-Device-OS: ${DeviceOS}`);
            });

            const Promise_DeviceOSVersion = this.sharedPreferencesPut('X-BoardActive-Device-OS-Version', this.device.version).then(_ => {
                DeviceOSVersion = this.device.version;
                console.log(`[BA:HttpHeaders] X-BoardActive-OS-Version: ${DeviceOSVersion}`);
            });

            const Promise_DeviceType = this.sharedPreferencesPut('X-BoardActive-Device-Type', this.device.model).then(_ => {
                DeviceType = this.device.model;
                console.log(`[BA:HttpHeaders] X-BoardActive-Device-Type: ${DeviceType}`);
            });

            const Promise_AppTest = new Promise(resolve => {
                this.localStorageService.getItem('AppTest').subscribe(appTest => {
                    AppTest = AppTest || appTest;
                    console.log(`[BA:HttpHeaders] X-BoardActive-Is-Test-App: ${AppTest}`);
                    this.sharedPreferencesPut('X-BoardActive-Is-Test-App', AppTest).then(_ => {
                        console.log(`[BA:HttpHeaders] -BoardActive-Is-Test-App: ${AppTest}`);
                    });
                    resolve(AppTest);
                });
            });


            Promise.all([
                Promise_URL,
                Promise_AppKey,
                Promise_AppID,
                Promise_AppVersionNumber,
                Promise_DeviceToken,
                Promise_AppTest,
                Promise_DeviceOS,
                Promise_DeviceOSVersion,
                Promise_DeviceType,
                Promise_AppTest
            ]).then(values => {
                const headers = new HttpHeaders()
                    .set('X-BoardActive-App-Key', `${AppKey}`)
                    .set('X-BoardActive-App-Id', `${AppID}`)
                    .set('X-BoardActive-App-Version', `${AppVersionNumber}`)
                    .set('X-BoardActive-Device-Token', `${DeviceToken}`)
                    .set('X-BoardActive-Device-OS', `${DeviceOS}`)
                    .set('X-BoardActive-Device-OS-Version', `${DeviceOSVersion}`)
                    .set('X-BoardActive-Device-Type', `${DeviceType}`)
                    .set('X-BoardActive-Is-Test-App', `${AppTest}`);
                resolve(headers);
                console.log(`Promise.all(): ${JSON.stringify(values, null, 2)}`);
            }).catch((error) => {
                console.log(`Promise.all()_err: ${error}`);
                reject(error);
            });
        }).catch((error) => {
            console.log(`generateHeaders_err: ${error}`);
            reject(error);
        });

    }

    /*
    END Springer REST API Calls
    *************************************************************************************************/


    /********************************************************x*x***************************************
    * START Cordova Plugin: cordova-plugin-app-version
    * Reads data from config.xml from the target build settings.
    */

    /**
     * Retrieves App Version Number from config.xml
     */
    async getVersionNumber(): Promise<any> {
        try {
            const versionNumber = await this.appVersion.getVersionNumber();
            return versionNumber;
        } catch (e) {
            console.error(`${e}`);
        }
    }

    /**
     * Retrieves App Package Name from config.xml
     */
    async getAppPackageName(): Promise<any> {
        try {
            const packageName = await this.appVersion.getPackageName();
            return packageName;
        } catch (e) {
            console.error(`${e}`);
        }
    }

    /**
     * Retrieves App Name from config.xml
     */
    async getAppName(): Promise<any> {
        try {
            const appName = await this.appVersion.getAppName();
            return appName;
        } catch (e) {
            console.error(`${e}`);
        }
    }

    /**
     * Retrieves App Version Code from config.xml
     */
    async getAppVersionCode(): Promise<any> {
        return this.appVersion.getVersionCode();
        // this.appVersion.getVersionCode().then(appVersionCode => {
        //     return appVersionCode;
        // }).catch(err => {
        //     return err;
        // });
    }


    /**
     * END Cordova Plugin: cordova-plugin-app-version
     *
     * /********************************************************x*x***************************************
     * Cordova Plugin: cordova-plugin-device
     * Reads device information
     */

    /**
     * Retrieves Device OS Version
     */
    getOSVersion(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.device.version);
        });
    }

    /**
     * Retrieves Device OS Version
     */
    getPlatform(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(this.device.platform);
        });
    }

    testGetRestApi(headers: boolean): Promise<any> {
        console.log(`[BA:BaClient] testGetRestApi()`);
        return new Promise((resolve, reject) => {
            const url = 'https://jsonplaceholder.typicode.com' + '/users';
            console.log(`[BA:testGetRestApi] url: ${url}`);
            if (headers) {
                this.generateHeaders().then(httpHeaders => {
                    console.log(`[BA:testGetRestApi] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
                    this.http.get(url, { headers: {} }).subscribe(response => {
                        console.log(`[BA:testGetRestApi] RESPONSE: ${JSON.stringify(response, null, 2)}`);
                        resolve(response);
                    }, err => {
                        console.log(`[BA:testGetRestApi] ERROR: ${err}`);
                        reject(err);
                    });
                });
            } else {
                this.http.get(url, { headers: {} }).subscribe(response => {
                    console.log(`[BA:testGetRestApi] RESPONSE: ${JSON.stringify(response, null, 2)}`);
                    resolve(response);
                }, err => {
                    console.log(`[BA:testGetRestApi] ERROR: ${err}`);
                    reject(err);
                });
            }
        });
    }

    welcomeNotification(type: number) {
        const myDate: string = new Date().toISOString();
        this.localStorageService.setItem('welcome', true).subscribe(() => {

        });
        this.localStorageService.setItem('msgType', type).subscribe(() => {

        });
        let messages: MessageDto[];
        messages = [];
        let msgCnt: any = this.localStorageService.getItem('msgCnt').subscribe(() => {
            if (msgCnt >= 1) {
                msgCnt = msgCnt + 1;
            } else {
                msgCnt = 1;
            }

            console.log(`msgCnt: ${msgCnt}`);
            this.localStorageService.setItem('msgCnt', msgCnt);
            let msg: MessageDto;
            msg = MessageModel.empty();
            msg.id = msgCnt;
            msg.body = 'Congratulations on successfully installing BoardActive’s app!';
            msg.messageId = '0000002';
            msg.tap = false;
            msg.dateCreated = myDate;
            msg.longitude = '';
            msg.latitude = '';
            msg.notificationId = '0000002';
            msg.title = 'Welcome';
            msg.dateCreated = myDate;
            msg.imageUrl = 'https://ba-us-east-1-develop.s3.amazonaws.com/test-78848f90-30d6-433f-a4b9-80752212dac1';
            msg.aps = '';
            msg.messageData = "{\"title\": \"An awesome promotion\",\"phoneNumber\": \"(678) 383-2200\",\"email\": \"info@boardactive.com\",\"storeAddress\": \"800 Battery Ave, SE Two Ballpark Center Suite 3132 Atlanta, GA 30339\",\"promoDateStarts\": \"5/1/19\",\"promoDateEnds\": \"10/1/19\",\"urlQRCode\": \"https://bit.ly/2FhOjiO\",\"urlLandingPage\": \"https://boardactive.com/\",\"urlFacebook\": \"https://www.facebook.com/BoardActive/\",\"urlLinkedIn\": \"https://www.linkedin.com/company/boardactive/\",\"urlTwitter\": \"https://twitter.com/boardactive\",\"urlYoutube\": \"https://www.youtube.com/embed/5Fi6surCFpQ\"}";
            this.addMessage(msg);
            this.newLocalNotification(msg, 1);
        });
    }

    newLocalNotification(msg: MessageDto, type: number) {
        this.localStorageService.setItem('msg', msg).subscribe(response => {
            this.events.publish('notification:receive');
        });
        console.log(`newLocalNotification`);
        switch (type) {
            case 1: // Basic Notification
                console.log(`localNotifications 1`);
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body,
                    foreground: true
                });
                break;
            case 2: // BigPic Notification
                console.log(`localNotifications 2`);
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body,
                    attachments: [msg.imageUrl],
                    foreground: true
                });
                break;
            case 3: // ActionButton Notification
                console.log(`localNotifications 3`);
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body,
                    foreground: true,
                    attachments: [msg.imageUrl],
                    actions: [
                        { id: 'yes', title: 'Yes' },
                        { id: 'no', title: 'No' }
                    ]
                });
                break;
            case 4: // Big Text Notification
                console.log(`localNotifications 4`);
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body,
                    foreground: true
                });
                break;
            case 5: // Inbox Notification
                console.log(`localNotifications 5`);
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body,
                    foreground: true
                });
                break;
            default:
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body,
                    foreground: true
                });
        }
    }

    addMessage(msg: MessageDto) {
        console.log(`addMessage`);
        // const myDate: string = new Date().toISOString();

        let messages: MessageDto[] = [];
        this.localStorageService.getItem('messages').subscribe(data => {
            if (data) {
                messages = data;
            }
            messages.push(msg);
            console.log(`messages: ${JSON.stringify(messages, null, 2)}`);
            this.localStorageService.setItem('messages', messages).subscribe((data) => {
                console.log(`addMessage() setItem: ${JSON.stringify(data, null, 2)}`);
                this.events.publish('notification:receive');
                // const log = {
                //     name: 'addMessage' + '-',
                //     timestamp: myDate,
                //     object: event,
                //     content: JSON.stringify(msg, null, 2)
                // };
                // this.addLogDB(log).then(result => {
                // });
            });
        });
    }

    addLogDB(logentry: any): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(`addLocalLog`);
            let logEntries = [];
            this.localStorageService.getItem('logDB').subscribe(log => {
                if (log) {
                    logEntries = log;
                }
                logEntries.push(logentry);
                this.localStorageService.setItem('logDB', logEntries).subscribe(() => {
                });
                resolve(logEntries);
            });
        });
    }


    defaultAttributes(): Promise<any> {
        var attributes: Attributes = {};
        return new Promise((resolve, reject) => {
            if (this.platform.is('android') || this.platform.is('ios')) {
                //Set Automatic User Attributes
                attributes.deviceOS = this.device.platform;
                attributes.deviceOSVersion = this.device.version;
                attributes.deviceType = this.device.model;
                this.localStorageService.getItem('token').subscribe(token => {
                    attributes.deviceToken = token;
                    this.diagnostic.isLocationAuthorized().then(data1 => {
                        attributes.locationPermission = data1;
                        this.diagnostic.isRemoteNotificationsEnabled().then(data2 => {
                            attributes.notificationPermission = data2;
                            resolve(attributes);
                        });
                    });
                });
            } else {
                //Set Automatic User Attributes
                attributes.deviceOS = null;
                attributes.deviceOSVersion = null;
                attributes.deviceType = null;
                attributes.locationPermission = null;
                attributes.notificationPermission = null;
                resolve(attributes);
            }
        });
    }
}
