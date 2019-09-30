import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BoardActiveService } from './services/boardactive/board-active.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { UtilService } from './services/util/util.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appMenu = [
    {
      title: 'Reports',
      icon: 'home',
      menuItem: 1,
      active: false
    }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private baService: BoardActiveService,
    private localStorageService: LocalStorageService,
    private utilService: UtilService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  menuAction(item: any) {
    switch (item.menuItem) {
      case 1:
        this.utilService.navigate('ba-reports', true);
        break;
      case 2:
          this.utilService.navigate('ba-reports-ngx', true);
          break;
      case 3:
        this.baService.generateHeaders().then(headers => {
          alert(`${JSON.stringify(headers, null, 2)}`);
        });
        break;
      case 4:
        this.baService.welcomeNotification(1);
        break;
      case 5:
        this.baService.welcomeNotification(2);
        break;
      case 6:
        this.baService.welcomeNotification(3);
        break;
      case 7:
        this.baService.welcomeNotification(4);
        break;
      case 8:
        this.baService.welcomeNotification(5);
        break;
    }
  }

}
