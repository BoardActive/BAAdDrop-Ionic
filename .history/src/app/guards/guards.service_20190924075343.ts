import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { BoardActiveService } from './../services/boardactive/board-active.service';
import { UtilService } from './../services/util/util.service';
import { Storage } from '@ionic/storage';
import { LocalStorageService } from '../services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GuardsService implements CanActivate {

  constructor(
    private baService: BoardActiveService,
    private utilService: UtilService,
    private storage: Storage,
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
