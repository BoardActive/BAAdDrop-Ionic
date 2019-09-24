import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { BoardActiveService } from './../services/boardactive/board-active.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class GuardsService implements CanActivate {

  constructor(
    private baService: BoardActiveService,
    private storage: Storage
  ) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    return true;
  }

}
