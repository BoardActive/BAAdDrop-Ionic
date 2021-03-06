import { Injectable } from '@angular/core';
// import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { Platform } from '@ionic/angular';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';

@Injectable({
  providedIn: 'root'
})
export class FCMService {

  constructor(
    // private fcm: FirebaseX,
    private firebaseMessaging: FirebaseMessaging,
    private platform: Platform,
    private localStorageService: LocalStorageService
  ) {

   }

  /**
   * Get Firebase Token
   * Determines which platform android or ios
   * Returns the FCM Token
   */
  getToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        if (this.platform.is('android')) {
          console.log(`[BA:platform_android]`);
          this.firebaseMessaging.getToken().then(token => {
            console.log(`[BA:__android_fcmToken] : ${token}`);
            this.localStorageService.setItem('token', token);
            resolve(token);
          }).catch(error => {
            console.log(`[BA:__android_error] : ${error}`);
            reject(error);
          });
        }
  
        if (this.platform.is('ios')) {
          console.log(`[BA:platform_ios]`);
          this.firebaseMessaging.requestPermission().then(res => {
            this.firebaseMessaging.getToken().then(token => {
              console.log(`[BA:__ios_fcmToken] : ${token}`);
              this.localStorageService.setItem('token', token);
              resolve(token);
            }).catch(error => {
              console.log(`[BA:__ios_error] : ${error}`);
              reject(error);
            });
          });
        }  
      }
    });
  }

  /**
   * Get Firebase Token
   * Determines which platform android or ios
   * Refreshed the FCM Token
   */
  getTokenRefresh(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.firebaseMessaging.onTokenRefresh().subscribe(token => {
          console.log(`[BA:__refresh_fcmToken] : ${token}`);
          this.localStorageService.setItem('token', token);
          resolve(token);
        });
      }
    });
  }

    /**
   * Get Firebase Token
   * Determines which platform android or ios
   * Refreshed the FCM Token
   */
  grantPermissions(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('ios')) {
        // token = await this.firebase.getToken();
        this.firebaseMessaging.requestPermission().then(res => {
          console.log(`[BA:__grantPermissions] : ${res}`);
          resolve(res);
        });
      }
    });
  }
  

  onMessageReceived() {
    return this.firebaseMessaging.onMessage();
  }
  
  onMessageReceivedBackground() {
    return this.firebaseMessaging.onBackgroundMessage();
  }


}
