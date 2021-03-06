import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { UtilService } from './../services/util/util.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GuardsService implements CanActivate {

  constructor(
    private utilService: UtilService,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    return this.localStorageService.getItem('auth').subscribe(auth => {
      console.log(`auth: ${auth}`);
      if(!auth) {
        this.utilService.navigate('/login', false);
      } else {
        return true;
      } 
    });

  }

}
