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
      title: 'Register Phone',
      icon: 'wallet',
      menuItem: 2
    },
    {
      title: 'View App Token',
      icon: 'home',
      menuItem: 1
    },
    {
      title: 'View App Variables',
      icon: 'time',
      menuItem: 3
    },
    {
      title: 'User Attributes',
      icon: 'time',
      menuItem: 4
    },
    {
      title: 'Device Attributes',
      icon: 'time',
      menuItem: 5
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private baService: BoardActiveService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  // what are all the other cases for? 
  menuAction(item: any) {
    switch (item.menuItem) {
      case 1:
        this.localStorageService.getItem('token').subscribe(token => {
          alert(`${token}`);
        });
        break;
      case 2:
        this.baService.putMe().subscribe(device => {
          alert(`${JSON.stringify(device, null, 2)}`);
        });
        break;
      case 3:
        this.baService.generateHeaders().then(headers => {
          alert(`${JSON.stringify(headers, null, 2)}`);
        });
        break;
      case 4:
        this.utilService.navigate('/ba-user', true);
        break;
      case 5:
        this.baService.defaultAttributes().then(data => {
          alert(`${JSON.stringify(data, null, 2)}`);
        });
        break;
    }
  }
  sendWelcomeMessage(type: any) {
    type = type || 1; // default to 1
    this.baService.welcomeNotification(type);
  }

  logout() {
    this.localStorageService.removeItem('auth');
    this.localStorageService.removeItem('apps');
    this.localStorageService.removeItem('appId');
    this.utilService.navigate('/login', false);
  }

  goApps() {
    this.utilService.navigate('/ba-apps', false);
  }

}

