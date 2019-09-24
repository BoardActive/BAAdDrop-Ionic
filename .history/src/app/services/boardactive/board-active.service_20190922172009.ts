import { Injectable } from '@angular/core';
import { FCMService } from '../fcm/fcm.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Me } from '../../models/me';
import { BaMessagePage } from '../../pages/ba/ba-message/ba-message.page';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Observable } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

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
    public isInit: boolean = false;
    public me: Me;
    public promotions: any[];

    constructor(
        private http: HttpClient,
        private storage: Storage,
        private fcmProvider: FCMService,
        private device: Device,
        private modalCtrl: ModalController,
        private appVersion: AppVersion,
        private localNotifications: LocalNotifications,
        private localStorageService: LocalStorageService
    ) {

    }

    /*
     * Initialize Client.
    * Clears App Icon Badges
    * Configures FCMProvider
    * Initializes Listener for Notifications from Server
    * @return {!Promise<any>}
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
                this.storage.set('token', token);
                this.fcmProvider.listenToNotifications().subscribe(response => {
                    this.postEvent('received', response.messageId, response['gcm.message_id'], response.isTestMessage);
                    if (response.tap) {
                        console.log(`[BA:TAP] : ` + JSON.stringify(response));
                        this.modalMessage(response);
                        this.postEvent('opened', response.messageId, response['gcm.message_id'], response.isTestMessage);
                    } else {
                        this.localNotifications.schedule({
                            id: 1,
                            title: response.title,
                            text: response.body,
                            data: { message: response }
                        });
                        console.log(`[BA:NOT_TAP] : ` + JSON.stringify(response));
                        this.postEvent('opened', response.messageId, response['gcm.message_id'], response.isTestMessage);
                    }
                })
                observer.next(token);
                observer.complete();
            })
        });
    }
    /*
    Gets the active Environment's root path
     * @return {string}
     */

    public getEnvironment(): Observable<any> {
        console.log(`[BA:BaClient] refreshFCMToken()`);

        return new Observable((observer) => {
            this.storage.get('environment').then(env => {
                console.log(`environment: ${env}`);
                switch (env) {
                    case 'prod': {
                        this.storage.set('AppKey', Config.APP_KEY.APP_KEY_PROD);
                        console.log(`${Config.APP_KEY.APP_KEY_PROD}`);
                        console.log(`${Config.API_URL.APP_URL_PROD}`);
                        observer.next(Config.API_URL.APP_URL_PROD);
                        observer.complete();
                        break;
                    }
                    case 'dev': {
                        this.storage.set('AppKey', Config.APP_KEY.APP_KEY_DEV);
                        console.log(`${Config.APP_KEY.APP_KEY_DEV}`);
                        console.log(`${Config.API_URL.APP_URL_DEV}`);
                        observer.next(Config.API_URL.APP_URL_DEV);
                        observer.complete();
                        break;
                    }
                    default: {
                        this.storage.set('AppKey', Config.APP_KEY.APP_KEY_PROD);
                        console.log(`${Config.APP_KEY.APP_KEY_PROD}`);
                        console.log(`${Config.API_URL.APP_URL_PROD}`);
                        observer.next(Config.API_URL.APP_URL_PROD);
                        observer.complete();
                    }
                }
            });

        });
    }

    async modalMessage(message: any) {
        const modal = await this.modalCtrl.create({
            component: BaMessagePage,
            componentProps: { message }
        });
        return await modal.present();
    }

    /*
    Refreshes the FCM Token
     * @return {!Promise<any>}
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
        this.postLocation(lat, lng).then(response => {

        });
    }

    /********************************************************x*x***************************************
    * START Springer REST API Calls
    * Reads data from config.xml from the target build settings.
    */

    /*
    GET /me
    * @return {!Promise<any>}
    */
    getMe(): Observable<any> {
        console.log(`[BA:BaClient] getMe()`);
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
    * @return {!Promise<any>}
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
                    // console.log(`[BA:postLogin]: ${JSON.stringify(response, null, 2)}`);
                    observer.next(response);
                    observer.complete();
                }, err => {
                    observer.next(err);
                    observer.complete();
                });

            })
        });

        // console.log(`[BA:BaClient] postLogin()`);
        // return new Observable((observer) => {
        //     const url = this.getEnvironment() + '/login';
        //     console.log(`[BA:postLogin] url: ${url}`);

        //     const body = {
        //         email: email,
        //         password: password
        //     };

        //     this.http.post(url, body, { params: {}, headers: {} }).subscribe((response) => {
        //         // console.log(`[BA:postLogin]: ${JSON.stringify(response, null, 2)}`);
        //         observer.next(response);
        //         observer.complete();
        //     }, err => {
        //         observer.next(err);
        //         observer.complete();
        //     });
        // });
    }

    /*
PUT /me
* @return {!Promise<any>}
*/
    putMe(): Observable<any> {
        return new Observable((observer) => {
            this.getEnvironment().subscribe(setUrl => {
                const url = setUrl + '/me';
                console.log(`[BA:putMe] url: ${url}`);
                this.storage.get('UserEmail').then(email => {
                    const deviceOS = this.device.platform;
                    const deviceOSVersion = this.device.version;

                    const body = {
                        email: email,
                        deviceOS: deviceOS,
                        deviceOSVersion: deviceOSVersion
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

        // console.log(`[BA:BaClient] putMe()`);
        // return new Promise((resolve, reject) => {
        //     const url = this.getEnvironment() + '/me';
        //     console.log(`[BA:putMe] url: ${url}`);
        //     this.storage.get('UserEmail').then(email => {
        //         const deviceOS = this.device.platform;
        //         const deviceOSVersion = this.device.version;

        //         const body = {
        //             email: email,
        //             deviceOS: deviceOS,
        //             deviceOSVersion: deviceOSVersion
        //         };
        //         console.log(`[BA:putMe] body: ${JSON.stringify(body, null, 2)}`);

        //         this.generateHeaders().then(httpHeaders => {
        //             console.log(`[BA:putMe] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
        //             this.http.put(url, body, { headers: httpHeaders }).subscribe(response => {
        //                 console.log(`[BA:putMe] RESPONSE: ${JSON.stringify(response, null, 2)}`);
        //                 resolve(response);
        //             }, err => {
        //                 console.log(`[BA:putMe] ERROR: ${JSON.stringify(err, null, 2)}`);
        //                 reject(err);
        //             });
        //         });
        //     });
        // });
    }

    /*
POST /me
* @return {!Promise<any>}
*/
    postMe(): Observable<any> {
        return new Observable((observer) => {
            this.getEnvironment().subscribe(setUrl => {
                const url = setUrl + '/me';
                console.log(`[BA:postMe] url: ${url}`);
                this.storage.get('UserEmail').then(email => {
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

        // console.log(`[BA:BaClient] postMe()`);
        // return new Promise((resolve, reject) => {
        //     const url = this.getEnvironment() + '/me';
        //     console.log(`[BA:postMe] url: ${url}`);
        //     this.storage.get('UserEmail').then(email => {
        //         const deviceOS = this.device.platform;
        //         const deviceOSVersion = this.device.version;

        //         const body = {
        //             email: email,
        //             deviceOS: deviceOS,
        //             deviceOSVersion: deviceOSVersion
        //         };
        //         console.log(`[BA:postMe] body: ${JSON.stringify(body, null, 2)}`);

        //         this.generateHeaders().then(httpHeaders => {
        //             console.log(`[BA:postMe] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
        //             this.http.post(url, body, { headers: httpHeaders }).subscribe(response => {
        //                 console.log(`[BA:postMe] RESPONSE: ${JSON.stringify(response, null, 2)}`);
        //                 resolve(response);
        //             }, err => {
        //                 console.log(`[BA:postMe] ERROR: ${JSON.stringify(err, null, 2)}`);
        //                 reject(err);
        //             });
        //         });
        //     });
        // });
    }
    /*
    POST /locations
    */
    // postLocation(latitude: string, longitude: string): void {
    //     console.log(`[BA:BaClient] postLocation()`);
    //     const url = this.getEnvironment() + '/locations';
    //     console.log(`[BA:postLocation] url: ${url}`);
    //     const body = {
    //         'latitude': latitude,
    //         'longitude': longitude,
    //         'deviceTime': new Date().toString()
    //     };

    //     this.generateHeaders().then(httpHeaders => {
    //         console.log(`[BA:postLocation] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
    //         this.http.post(url, body, { headers: httpHeaders }).subscribe(response => {
    //             console.log(`[BA:postLocation] RESPONSE: ${JSON.stringify(response, null, 2)}`);
    //         }, err => {
    //             console.log(`[BA:postLocation] RESPONSE: ${JSON.stringify(err, null, 2)}`);
    //         });
    //     });
    // }

    /*
    POST /locations
    */
    postLocation(latitude: string, longitude: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getEnvironment().subscribe(setUrl => {
                const url = setUrl + '/locations';
                console.log(`[BA:postLocationPromise] url: ${url}`);
                const body = {
                    'latitude': latitude,
                    'longitude': longitude,
                    'deviceTime': new Date().toString()
                };

                this.generateHeaders().then(httpHeaders => {
                    console.log(`[BA:postLocationPromise] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
                    this.http.post(url, body, { headers: httpHeaders }).subscribe(response => {
                        console.log(`[BA:postLocationPromise] RESPONSE: ${JSON.stringify(response, null, 2)}`);
                        resolve(response);
                    }, err => {
                        console.log(`[BA:postLocationPromise] ERROR: ${err}`);
                        reject(err);
                    });
                });
            })
        });

        // console.log(`[BA:BaClient] postLocationPromise()`);
        // return new Promise((resolve, reject) => {

        //     const url = this.getEnvironment() + '/locations';
        //     console.log(`[BA:postLocationPromise] url: ${url}`);
        //     const body = {
        //         'latitude': latitude,
        //         'longitude': longitude,
        //         'deviceTime': new Date().toString()
        //     };

        //     this.generateHeaders().then(httpHeaders => {
        //         console.log(`[BA:postLocationPromise] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
        //         this.http.post(url, body, { headers: httpHeaders }).subscribe(response => {
        //             console.log(`[BA:postLocationPromise] RESPONSE: ${JSON.stringify(response, null, 2)}`);
        //             resolve(response);
        //         }, err => {
        //             console.log(`[BA:postLocationPromise] ERROR: ${JSON.stringify(err, null, 2)}`);
        //             reject(err);
        //         });
        //     });
        // });
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

        // console.log(`[BA:BaClient] postEvent()`);
        // const url = this.getEnvironment() + '/events';
        // console.log(`[BA:postEvent] url: ${url}`);
        // const body = {
        //     'name': name,
        //     'messageId': messageId,
        //     'firebaseNotificationId': firebaseNotificationId,
        //     'isTestMessage': testMsg
        // };

        // this.generateHeaders().then(httpHeaders => {
        //     console.log(`[BA:postEvent] httpHeaders: ${JSON.stringify(httpHeaders, null, 2)}`);
        //     this.http.post(url, body, { headers: httpHeaders }).subscribe(response => {
        //         console.log(`[BA:postEvent] RESPONSE: ${JSON.stringify(response, null, 2)}`);
        //     }, err => {
        //         console.log(`[BA:postEvent] ERROR: ${JSON.stringify(err, null, 2)}`);
        //     });
        // });
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
        AppTest?: string
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            const Promise_AppKey = this.storage.get('AppKey').then(appKey => {
                AppKey = AppKey || appKey;
                console.log(`X-BoardActive-App-Key: ${AppKey}`);
                return AppKey;
            }).catch((error) => {
                console.log(`AppKey_err: ${error}`);
            });

            const Promise_AppID = this.storage.get('AppID').then(appId => {
                AppID = AppID || appId;
                console.log(`X-BoardActive-App-Id: ${AppID}`);
                return AppID;
            }).catch((error) => {
                console.log(`AppID_err: ${error}`);
            });

            const Promise_AppVersionNumber = this.getAppVersionCode().then(appVerNo => {
                AppVersionNumber = AppVersionNumber || appVerNo;
                console.log(`X-BoardActive-App-Version: ${AppVersionNumber}`);
                return AppVersionNumber;
            }).catch((error) => {
                console.log(`AppVersionNumber_err: ${error}`);
            });

            const Promise_DeviceToken = this.storage.get('token').then(token => {
                DeviceToken = DeviceToken || token;
                console.log(`X-BoardActive-App-Token: ${DeviceToken}`);
                return DeviceToken;
            }).catch((error) => {
                console.log(`token_err: ${error}`);
            });

            DeviceOS = this.device.platform;
            DeviceOSVersion = this.device.version;

            const Promise_AppTest = this.storage.get('AppTest').then(appTest => {
                AppTest = AppTest || appTest;
                console.log(`X-BoardActive-Is-Test-App: ${AppTest}`);
            }).catch((error) => {
                console.log(`AppTest_err: ${error}`);
            });

            Promise.all([
                Promise_AppKey,
                Promise_AppID,
                Promise_AppVersionNumber,
                Promise_DeviceToken,
                Promise_AppTest
            ]).then(values => {
                const headers = new HttpHeaders()
                    .set('X-BoardActive-App-Key', `${AppKey}`)
                    .set('X-BoardActive-App-Id', `${AppID}`)
                    .set('X-BoardActive-App-Version', `${AppVersionNumber}`)
                    .set('X-BoardActive-Device-Token', `${DeviceToken}`)
                    .set('X-BoardActive-Device-OS', `${DeviceOS}`)
                    .set('X-BoardActive-Device-OS-Version', `${DeviceOSVersion}`)
                    .set('X-BoardActive-Is-Test-App', `${AppTest}`);
                // headers = headers.append('X-BoardActive-App-Key', `${AppKey}`);
                // headers = headers.append('X-BoardActive-App-Id', `${AppID}`);
                // headers = headers.append('X-BoardActive-App-Version', `${AppVersionNumber}`);
                // headers = headers.append('X-BoardActive-Device-Token', `${DeviceToken}`);
                // headers = headers.append('X-BoardActive-Device-OS', `${DeviceOS}`);
                // headers = headers.append('X-BoardActive-Device-OS-Version', `${DeviceOSVersion}`);
                // headers = headers.append('X-BoardActive-Is-Test-App', `${AppTest}`);
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
        console.log(`welcomeNotification`);
        let welcomeMsg: MessageDto;
        welcomeMsg = MessageModel.empty();
        welcomeMsg.messageId = '0000001';
        welcomeMsg.notificationId = '0000001';
        welcomeMsg.title = 'Welcome';
        welcomeMsg.body = 'Congratulations on successfully installing BoardActive’s app!';
        welcomeMsg.imageUrl = 'https://ba-us-east-1-develop.s3.amazonaws.com/test-5d3ba9d0-cb1d-49ee-99f3-7bef45994e71';    
    
        this.addMessage(welcomeMsg, type);
        this.localStorageService.setItem('welcome', true);
    }

    newLocalNotification(msg: MessageDto, type: number) {
        console.log(`newLocalNotification`);
        switch (type) {
            case 1: // Basic Notification
                this.localNotifications.schedule({
                    id: 1,
                    title: msg.title,
                    text: msg.body
                });
                break;
            case 2: // BigPic Notification
                this.localNotifications.schedule({
                    id: 1,
                    title: msg.title,
                    text: msg.body,
                    attachments: [msg.imageUrl],
                });
                break;
            case 3: // ActionButton Notification
                this.localNotifications.schedule({
                    id: 1,
                    title: msg.title,
                    text: msg.body,
                    attachments: [msg.imageUrl],
                    actions: [
                        { id: 'yes', title: 'Yes' },
                        { id: 'no',  title: 'No' }
                    ]
                });
                break;
            case 4: // Big Text Notification
                this.localNotifications.schedule({
                    id: 1,
                    title: msg.title,
                    text: msg.body
                });
                break;
            case 5: // Inbox Notification
                this.localNotifications.schedule({
                    id: 1,
                    title: msg.title,
                    text: msg.body
                });
                break;
        }
    }

    addMessage(msg: MessageDto, type: number) {
        console.log(`addMessage`);
        let messages: MessageDto[] = [];        
        messages = this.localStorageService.getItem('messages');
        messages.push(msg);
        this.localStorageService.setItem('messages', messages);

        this.storage.get('messages').then(data => {
            messages = data;
            messages.push(msg);
            console.log(`messages: ${messages}`);
            this.storage.set('messages', messages).then(date => {
            });
        });
        this.newLocalNotification(msg, type);

    }
}
