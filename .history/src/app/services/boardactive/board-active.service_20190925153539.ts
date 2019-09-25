import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { FCMService } from '../fcm/fcm.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { Me } from '../../models/me';
import { BaMessagePage } from '../../pages/ba/ba-message/ba-message.page';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Observable } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { tap } from 'rxjs/operators';

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
        private fcmProvider: FCMService,
        private device: Device,
        private modalCtrl: ModalController,
        private appVersion: AppVersion,
        private localNotifications: LocalNotifications,
        private localStorageService: LocalStorageService,
        private events: Events
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
                this.localStorageService.setItem('token', token).subscribe(token => {
                    observer.next(token);
                    observer.complete();
                });
            });

            
            // .pipe(tap(payload => {
            //     let thisMsg: MessageDto;
            //     thisMsg = payload;
            //     thisMsg.notificationId = payload['gcm.message_id'];
            //     thisMsg.dateCreated = myDate;
            //     this.localStorageService.setItem('msg', thisMsg).subscribe(response => {
            //         this.events.publish('notification:receive');
            //     });

            //     this.postEvent('received', thisMsg.messageId, thisMsg['gcm.message_id'], thisMsg.isTestMessage);
            //     if (thisMsg.tap) {
            //         this.postEvent('opened', thisMsg.messageId, thisMsg.notificationId, thisMsg.isTestMessage);
            //         this.modalMessage(payload);
            //     } else {
            //         this.newLocalNotification(thisMsg, 1);
            //     }
            // }))


            this.fcmProvider.listenToNotifications().subscribe(response => {
                // const myDate: string = new Date().toISOString();
                console.log(`listenToNotifications: ${JSON.stringify(response, null, 2)}`);
                let msg: MessageDto = MessageModel.empty();
                msg = response;
                msg.notificationId = response['gcm.message_id'];
                this.addMessage(msg);
                this.localStorageService.setItem('msg', msg).subscribe(response => {
                    this.events.publish('notification:receive');
                });
                this.postEvent('received', response.messageId, response['gcm.message_id'], response.isTestMessage);
                if (msg.tap) {
                    console.log(`[BA:TAP] : ` + JSON.stringify(msg));
                    this.localStorageService.setItem('msg', msg).subscribe(response => {
                        this.events.publish('notification:tap');
                    });
                    this.modalMessage(response);
                } else {
                    console.log(`[BA:NOT_TAP] : ` + JSON.stringify(response));
                    // this.localStorageService.getItem(`msgType`).subscribe(type => {
                    this.newLocalNotification(msg, 1);
                    // });
                }
            });
        });
    }

    
    /*
    Gets the active Environment's root path
     * @return {string}
     */

    public getEnvironment(): Observable<any> {
        console.log(`[BA:BaClient] refreshFCMToken()`);

        return new Observable((observer) => {
            this.localStorageService.getItem('environment').subscribe(env => {
                console.log(`environment: ${env}`);
                switch (env) {
                    case 'prod': {
                        this.localStorageService.setItem('AppKey', Config.APP_KEY.APP_KEY_PROD).subscribe(() => {
                            console.log(`${Config.APP_KEY.APP_KEY_PROD}`);
                            console.log(`${Config.API_URL.APP_URL_PROD}`);
                            observer.next(Config.API_URL.APP_URL_PROD);
                            observer.complete();
                        });
                        break;
                    }
                    case 'dev': {
                        this.localStorageService.setItem('AppKey', Config.APP_KEY.APP_KEY_DEV).subscribe(() => {
                            console.log(`${Config.APP_KEY.APP_KEY_DEV}`);
                            console.log(`${Config.API_URL.APP_URL_DEV}`);
                            observer.next(Config.API_URL.APP_URL_DEV);
                            observer.complete();
                        });
                        break;
                    }
                    default: {
                        this.localStorageService.setItem('AppKey', Config.APP_KEY.APP_KEY_PROD).subscribe(() => {
                            console.log(`${Config.APP_KEY.APP_KEY_PROD}`);
                            console.log(`${Config.API_URL.APP_URL_PROD}`);
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
        this.postLocation(lat, lng).subscribe(response => {

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
                this.localStorageService.getItem('UserEmail').subscribe(email => {
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

            const Promise_AppKey = new Promise(resolve => {
                this.localStorageService.getItem('AppKey').subscribe(appKey => {
                    AppKey = AppKey || appKey;
                    console.log(`X-BoardActive-App-Key: ${AppKey}`);
                    resolve(AppKey);
                });
            });

            // const Promise_AppKey = this.localStorageService.getItem('AppKey').subscribe(appKey => {
            //     AppKey = AppKey || appKey;
            //     console.log(`X-BoardActive-App-Key: ${AppKey}`);
            //     return AppKey;
            // });

            const Promise_AppID = new Promise(resolve => {
                this.localStorageService.getItem('AppID').subscribe(appId => {
                    AppID = AppID || appId;
                    console.log(`X-BoardActive-App-Id: ${AppID}`);
                    resolve(AppID);
                });
            });

            // const Promise_AppID = this.localStorageService.getItem('AppID').subscribe(appId => {
            //     AppID = AppID || appId;
            //     console.log(`X-BoardActive-App-Id: ${AppID}`);
            //     return AppID;
            // });

            const Promise_AppVersionNumber = this.getAppVersionCode().then(appVerNo => {
                AppVersionNumber = AppVersionNumber || appVerNo;
                console.log(`X-BoardActive-App-Version: ${AppVersionNumber}`);
                return AppVersionNumber;
            }).catch((error) => {
                console.log(`AppVersionNumber_err: ${error}`);
            });

            const Promise_DeviceToken = this.localStorageService.getItem('token').subscribe(token => {
                DeviceToken = DeviceToken || token;
                console.log(`X-BoardActive-App-Token: ${DeviceToken}`);
                return DeviceToken;
            });

            DeviceOS = this.device.platform;
            DeviceOSVersion = this.device.version;

            const Promise_AppTest = new Promise(resolve => {
                this.localStorageService.getItem('AppTest').subscribe(appTest => {
                    AppTest = AppTest || appTest;
                    console.log(`X-BoardActive-Is-Test-App: ${AppTest}`);
                    resolve(AppTest);
                });
            });

            // const Promise_AppTest = this.localStorageService.getItem('AppTest').subscribe(appTest => {
            //     AppTest = AppTest || appTest;
            //     console.log(`X-BoardActive-Is-Test-App: ${AppTest}`);
            // });

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
            msg.messageId = '0000002';
            msg.notificationId = '0000002';
            msg.title = 'Welcome';
            msg.body = 'Congratulations on successfully installing BoardActive’s app!';
            msg.imageUrl = 'https://ba-us-east-1-develop.s3.amazonaws.com/test-78848f90-30d6-433f-a4b9-80752212dac1';
            msg.dateCreated = myDate;

            this.addMessage(msg);

        });
    }

    newLocalNotification(msg: MessageDto, type: number) {
        console.log(`newLocalNotification`);
        switch (type) {
            case 1: // Basic Notification
                console.log(`localNotifications 1`);
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body
                });
                break;
            case 2: // BigPic Notification
                console.log(`localNotifications 2`);
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body,
                    attachments: [msg.imageUrl],
                });
                break;
            case 3: // ActionButton Notification
                console.log(`localNotifications 3`);
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body,
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
                    text: msg.body
                });
                break;
            case 5: // Inbox Notification
                console.log(`localNotifications 5`);
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body
                });
                break;
            default:
                this.localNotifications.schedule({
                    id: msg.id,
                    title: msg.title,
                    text: msg.body
                });
        }
    }

    addMessage(msg: MessageDto) {
        console.log(`addMessage`);
        let messages: MessageDto[] = [];
        this.localStorageService.getItem('messages').subscribe(data => {
            if (data) {
                messages = data;
            }
            messages.push(msg);
            console.log(`messages: ${JSON.stringify(messages, null, 2)}`);
            this.localStorageService.setItem('messages', messages).subscribe((data) => {
                console.log(`addMessage() setItem: ${JSON.stringify(data, null, 2)}`);
            });
        });
    }
}
