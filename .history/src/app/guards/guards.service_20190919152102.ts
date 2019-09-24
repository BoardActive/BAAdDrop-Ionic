import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { UtilService } from '../services/util/util.service';
import { AuthenticationService } from '../services/firestore/firebase-authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserDataService } from '../services/data-services/user-data.service'
import { UserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GuardsService implements CanActivate {
  public thisUser: UserDto;

  constructor(
    private utilService: UtilService,
    private authServ: AuthenticationService,
    private userDataService: UserDataService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    return this.authServ.checkAuth().then(user => {
      const loginUser: any = user;
      if (user) {
        this.authServ.emailVerified().then(verified => {
          if (verified) {
            this.userDataService.getOne(loginUser.uid).subscribe(data => {
              this.thisUser = data;
              if (this.thisUser.pozerTour) {
                // return true;
                this.utilService.navigate('/pozer-home', false);
              } else {
                this.utilService.navigate('/pozer-welcome', false);
              }
            });
          } else {
            this.utilService.navigate('/pozer-verify', true);
          }
        });
      } else {
        localStorage.setItem('verified', 'false');
        this.utilService.navigate('login', true);
      }
    });

  }

}
