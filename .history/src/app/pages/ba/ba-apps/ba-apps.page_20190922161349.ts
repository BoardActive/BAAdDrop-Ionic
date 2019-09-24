import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UtilService } from '../../../services/util/util.service';
import { AppDto } from 'src/app/models/app.model';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { MessageDto } from 'src/app/models/message.model';

@Component({
  selector: 'app-ba-apps',
  templateUrl: './ba-apps.page.html',
  styleUrls: ['./ba-apps.page.scss'],
})
export class BaAppsPage implements OnInit {
  public appData: AppDto;
  public apps: [];

  constructor(
    private storage: Storage,
    private utilService: UtilService,
    private menuCtrl: MenuController,
    private localStorageService: LocalStorageService,
    private baService: BoardActiveService
  ) { }

  ngOnInit() {
    this.storage.get('auth').then(auth => {
      console.log(`${auth}`);
      if (auth) {
        this.storage.get('apps').then(data => {
          this.appData = data;
          this.apps = data.apps;
          console.log(`${JSON.stringify(this.appData, null, 2)}`);
        });
      } else {
        this.signOut();
      }
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  signOut() {
    this.storage.remove('auth');
    this.storage.remove('apps');
    this.utilService.navigate('/login', false);
  }

  selectApp(item: any) {
    const welcome = this.localStorageService.getItem('welcome');

    if(!welcome){
      this.baService.welcomeNotification(1);
    } 

    this.storage.set('AppID', item.id);
    this.utilService.navigate('/ba-messages', false);
  }
}
