import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable, Subscriber } from "rxjs";
import { map, filter, scan } from "rxjs/operators";
import { UsersDto } from "../../../core/models/users.model";
import { PlacesDto } from "../../../core/models/places.model";
import { MessagesDto } from "../../../core/models/messages.model";
import { LocalStorageService } from '../../../core/local-storage/local-storage.service';
import { MeDto } from '../../../core/models/me.model';
@Injectable({
  providedIn: "root"
})
export class BAService {
  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService
  ) { }

  /** START Auth Endpoints *********************************************************************
   * POST /login
   * POST /logout
   * GET /auth-config/google
   * GET /auth-config/braintree-client-token
   */

  public postLogin(
    email: string,
    password: string,
    userIdToken?: string
  ): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/login';

      const body = {
        email: email,
        password: password,
        userIdToken: userIdToken
      };

      this.http.post(url, body, {}).subscribe(
        response => {
          observer.next(response);
          observer.complete();
        },
        err => {
          observer.next(err);
          observer.complete();
        }
      );
    });
  }

  public postLogout(): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/logout';
      const body = {};

      this.generateHeaders().subscribe(headers => {
        this.http.post(url, body, { headers: headers }).subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          err => {
            observer.next(err);
            observer.complete();
          }
        );
      });
    });
  }

  public getAuthGoogle(): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/auth-config/google';

      this.http.post(url, environment.httpParams).subscribe(
        response => {
          observer.next(response);
          observer.complete();
        },
        err => {
          observer.next(err);
          observer.complete();
        }
      );
    });
  }

  public getAuthBraintree(): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/auth-config/google';

      this.http.post(url, environment.httpParams).subscribe(
        response => {
          observer.next(response);
          observer.complete();
        },
        err => {
          observer.next(err);
          observer.complete();
        }
      );
    });
  }

  /** END Auth Endpoints ***************************************************************************/

  /** START Apps Endpoints *********************************************************************
   * POST /apps
   * GET /apps
   * POST /apps/check-app
   * GET /apps/:id
   * PUT /apps/:id
   * PUT /apps/:id/images
   * POST /apps/:id/users
   * PUT /apps/:id/users/:id
   * PUT /apps/:id/users/:id/trash
   * POST /apps/:id/users/:id/reinvite
   */

  /** END Apps Endpoints ***************************************************************************/

  /** START Billing Endpoints *********************************************************************
   * GET /billing-plans
   */

  /** END Billing Endpoints ***************************************************************************/

  /** START App Endpoints
   * PUT /apps/:id/subscribe
   * PUT /apps/:id/unsubscribe
   */

  /** END Auth Endpoints */

  /** START Users Endpoints
   * POST /users
   *    BODY: isCompliant
   *          email+
   *          password+
   *          userIdToken+
   *          firstName*
   *          lastName*
   *          avatarUrl*
   *          inbox*
   * GET /users
   *    HEADERS: ba-app-id
   * POST /users/check-email
   *    BODY: email
   * POST /users/password/reset
   *    BODY: email
   * PUT /users/password
   * POST /users/ack/resend
   * PUT /users/ack
   * POST /users/claim/resend
   * PUT /users/claim
   * PUT /users/:id
   *    HEADERS: ba-app-id 
   * GET /users/:id
   *    HEADERS: ba-app-id 
   * GET /me
   * PUT /me
   * PUT /me/password
   * PUT /me/images
   * POST /payment-methods
   * PUT /payment-methods/:id
   * GET /payment-methods
   */

  public postMe(): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/me';

      this.generateHeaders().subscribe(headers => {
        this.http
          .post(url, { headers: headers }, environment.httpParams)
          .subscribe(
            response => {
              observer.next(response);
              observer.complete();
            },
            err => {
              observer.next(err);
              observer.complete();
            }
          );
      });
    });
  }


  public getMe(): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/me';
        console.log(`+++`);
        this.http
          .get<MeDto[]>(url, {
            headers: {},
            withCredentials: true
          })
          .subscribe(
            response => {
              console.log(`---`);
              console.log(`${JSON.stringify(response, null, 2)}`);
              observer.next(response);
              observer.complete();
            },
            err => {
              observer.next(err);
              observer.complete();
            }
          );
      });
  }

  public getUsers(): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/users';

      this.generateHeaders().subscribe(headers => {
        console.log(`+++`);
        console.log(`header: ${JSON.stringify(headers, null, 2)}`);
        this.http
          .get<UsersDto[]>(url, {
            headers: headers,
            withCredentials: true
          })
          .subscribe(
            response => {
              console.log(`---`);
              console.log(`${JSON.stringify(response, null, 2)}`);
              observer.next(response);
              observer.complete();
            },
            err => {
              observer.next(err);
              observer.complete();
            }
          );
      });
    });
  }


  /** END Users Endpoints */

  // /** START Places Endpoints

  public getPlaces(): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/places';

      this.generateHeaders().subscribe(headers => {
        console.log(`+++`);
        console.log(`header: ${JSON.stringify(headers, null, 2)}`);
        this.http
          .get<PlacesDto[]>(url, {
            headers: headers,
            withCredentials: true
          })
          .subscribe(
            response => {
              console.log(`---`);
              console.log(`${JSON.stringify(response, null, 2)}`);
              observer.next(response);
              observer.complete();
            },
            err => {
              observer.next(err);
              observer.complete();
            }
          );
      });
    });
  }

  public putPlace(id: any): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + `/places/${id}`;
      const body = {};

      this.generateHeaders().subscribe(headers => {
        console.log(`+++`);
        console.log(`${JSON.stringify(headers, null, 2)}`);
        this.http
          .put<PlacesDto[]>(url, {}, {
            headers: headers,
            withCredentials: true
          })
          .subscribe(
            response => {
              console.log(`---`);

              console.log(`${JSON.stringify(response, null, 2)}`);

              observer.next(response);
              observer.complete();
            },
            err => {
              observer.next(err);
              observer.complete();
            }
          );
      });
    });
  }

  /** END Places Endpoints */

  // /** START Place Types Endpoints

  // /** END Place Types Endpoints */

  /** START Messages Endpoints
   *
   */

  public getMessages(): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/messages';

      this.generateHeaders().subscribe(headers => {
        console.log(`+++`);
        console.log(`header: ${JSON.stringify(headers, null, 2)}`);
        this.http
          .get<MessagesDto[]>(url, {
            headers: headers,
            withCredentials: true
          })
          .subscribe(
            response => {
              console.log(`---`);
              console.log(`${JSON.stringify(response, null, 2)}`);
              observer.next(response);
              observer.complete();
            },
            err => {
              observer.next(err);
              observer.complete();
            }
          );
      });
    });
  }

  /** END Messages Endpoints */

  /** START Attributes Endpoints
   *
   */

  /** END Attributes Endpoints */

  /** START Mobile Users Endpoints
   *
   */

  /** END Mobile Users Endpoints */

  /** START Audiences Endpoints
   *
   */

  /** END Audiences Endpoints */

  public getApps(): Observable<any> {
    return new Observable(observer => {
      const url = environment.server + '/apps';

      this.generateHeaders().subscribe(headers => {
        console.log(`+++`);
        console.log(`header: ${JSON.stringify(headers, null, 2)}`);
        this.http
          .get<PlacesDto[]>(url, {
            headers: headers,
            withCredentials: true
          })
          .subscribe(
            response => {
              console.log(`---`);
              console.log(`${JSON.stringify(response, null, 2)}`);
              observer.next(response);
              observer.complete();
            },
            err => {
              observer.next(err);
              observer.complete();
            }
          );
      });
    });
  }

  private generateHeaders(): Observable<any> {
    return new Observable(observer => {
      let headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('ba-app-id', '143');
      // headers = headers.append('Content-Type', 'application/json');
      // headers = headers.append('ba-app-id', AppId);
      observer.next(headers);
      observer.complete();
    });

  }

  private getAppId(): Observable<any> {
    return new Observable(observer => {
      const appId = this.storageService.getItem('appId');
      observer.next(appId);
      observer.complete();
    });
  }

}

