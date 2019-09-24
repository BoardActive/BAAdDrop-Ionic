import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util/util.service';
import { AppDto } from 'src/app/models/app.model';
import { MenuController } from '@ionic/angular';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';

@Component({
  selector: 'app-ba-apps',
  templateUrl: './ba-apps.page.html',
  styleUrls: ['./ba-apps.page.scss'],
})
export class BaAppsPage implements OnInit {
  public appData: AppDto;
  public apps: [];

  constructor(
    private utilService: UtilService,
    private menuCtrl: MenuController,
    private localStorageService: LocalStorageService,
    private baService: BoardActiveService
  ) { }

  ngOnInit() {
    this.localStorageService.getItem('auth').subscribe(auth => {
      console.log(`${auth}`);
      if (auth) {
        this.localStorageService.getItem('apps').subscribe(data => {
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
    this.localStorageService.removeItem('auth');
    this.localStorageService.removeItem('apps');
    this.utilService.navigate('/login', false);
  }

  selectApp(item: any) {
    const welcome = this.localStorageService.getItem('welcome');
    console.log(`welcome: ${welcome}`);
    if(!welcome){
      this.baService.welcomeNotification(1);
    } 

    this.localStorageService.setItem('AppID', item.id).subscribe(() => {
      this.utilService.navigate('/ba-messages', false);
    });

  }
}
