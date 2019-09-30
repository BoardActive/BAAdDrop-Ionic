import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { UtilService } from './../services/util/util.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class GuardsService implements CanActivate {

  constructor(
    private utilService: UtilService,
    private storage: Storage,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    return this.storage.get('auth').then(auth => {
      console.log(`auth: ${auth}`);
      if(!auth) {
        this.utilService.navigate('/login', false);
      } else {
        return true;
      } 
    });

  }

}
