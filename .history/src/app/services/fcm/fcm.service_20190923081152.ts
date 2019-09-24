import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';

import { Platform } from '@ionic/angular';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FCMService {

  constructor(
    private fcm: Firebase,
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
          this.fcm.getToken().then(token => {
            console.log(`[BA:__android_fcmToken] : ${token}`);
            this.localStorageService.setItem('token', token);
            localStorage.setItem('token', token);
            resolve(token);
          }).catch(error => {
            console.log(`[BA:__android_error] : ${error}`);
            reject(error);
          });
        }
  
        if (this.platform.is('ios')) {
          console.log(`[BA:platform_ios]`);
          this.fcm.grantPermission().then(res => {
            this.fcm.getToken().then(token => {
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
        this.fcm.onTokenRefresh().subscribe(token => {
          console.log(`[BA:__refresh_fcmToken] : ${token}`);
          this.localStorageService.setItem('token', token);
          localStorage.setItem('token', token);
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
        this.fcm.grantPermission().then(res => {
          console.log(`[BA:__grantPermissions] : ${res}`);
          resolve(res);
        });
      }
    });
  }
  
  listenToNotifications() {
    return this.fcm.onNotificationOpen();
  }
  


}
