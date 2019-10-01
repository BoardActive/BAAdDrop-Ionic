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
  }

  removeItem(key: string) {
    this.storage.remove(`${APP_PREFIX}${key}`);
  }

  testLocalStorage() {
    const testValue = 'testValue';
    const testKey = 'testKey';
    let retrievedValue: string;
    const errorMessage = 'localStorage did not return expected value';

    this.setItem(testKey, testValue).subscribe(data => {
      this.getItem(testKey).subscribe(data => {
        retrievedValue = data;
        this.removeItem(testKey);
      });  
    });

    if (retrievedValue !== testValue) {
      throw new Error(errorMessage);
    }
  }
}
