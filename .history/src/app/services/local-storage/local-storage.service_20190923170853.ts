import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

const APP_PREFIX = 'ba-';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(
    private storage: Storage
  ) {}

  static loadInitialState() {
    return Object.keys(localStorage).reduce((state: any, storageKey) => {
      if (storageKey.includes(APP_PREFIX)) {
        const stateKeys = storageKey
          .replace(APP_PREFIX, '')
          .toLowerCase()
          .split('.')
          .map(key =>
            key
              .split('-')
              .map((token, index) =>
                index === 0
                  ? token
                  : token.charAt(0).toUpperCase() + token.slice(1)
              )
              .join('')
          );
        let currentStateRef = state;
        stateKeys.forEach((key, index) => {
          if (index === stateKeys.length - 1) {
            currentStateRef[key] = JSON.parse(localStorage.getItem(storageKey));
            return;
          }
          currentStateRef[key] = currentStateRef[key] || {};
          currentStateRef = currentStateRef[key];
        });
      }
      return state;
    }, {});
  }

  setItem(key: string, value: any): Observable<any> {
    return new Observable((observer) => {
      this.storage.set(`${APP_PREFIX}${key}`, value).then(data => {
        observer.next(data);
        observer.complete();
      });
    });
  }

  getItem(key: string): Observable<any> {
    return new Observable((observer) => {
      this.storage.get(`${APP_PREFIX}${key}`).then(data => {
        observer.next(data);
        observer.complete();
      });
    });
    // return JSON.parse(localStorage.getItem(`${APP_PREFIX}${key}`));
  }

  removeItem(key: string) {
    this.storage.remove(`${APP_PREFIX}${key}`);
    // localStorage.removeItem(`${APP_PREFIX}${key}`);
  }

  /** Tests that localStorage exists, can be written to, and read from. */
  testLocalStorage() {
    const testValue = 'testValue';
    const testKey = 'testKey';
    let retrievedValue: string;
    const errorMessage = 'localStorage did not return expected value';

    this.setItem(testKey, testValue);
    this.getItem(testKey).subscribe(data => {
      retrievedValue = data;
    });
    this.removeItem(testKey);

    if (retrievedValue !== testValue) {
      throw new Error(errorMessage);
    }
  }
}
