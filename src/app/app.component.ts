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
  public AppName;
  public isCordova: boolean = false;
  public appMenu = [
    {
      title: 'Register Phone',
      icon: 'wallet',
      menuItem: 1
    },
    {
      title: 'View App Token',
      icon: 'home',
      menuItem: 2
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
      title: 'Custom Attributes',
      icon: 'time',
      menuItem: 5
    },
    {
      title: 'Default SDK Attributes',
      icon: 'time',
      menuItem: 6
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private boardActiveService: BoardActiveService,
    private utilService: UtilService,
    private localStorageService: LocalStorageService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.isCordova = true;
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.localStorageService.getItem('App').subscribe(name => {
          this.AppName = name;
        });
      } else {
        this.isCordova = false;
      }
    });
  }

  // what are all the other cases for? 
  menuAction(item: any) {
    // alert(`${JSON.stringify(item, null, 2)}`);
    switch (item.menuItem) {
      case 1:
        if (this.platform.is('cordova')) {
          this.boardActiveService.putMe().then(device => {
            alert(`${JSON.stringify(device, null, 2)}`);
          });
        } else {
          alert(`Cordova not present.`);
        }
        break;
      case 2:
        if (this.platform.is('cordova')) {
          this.localStorageService.getItem('token').subscribe(token => {
            alert(`${token}`);
          });
        } else {
          alert(`Cordova not present.`);
        }
        break;
      case 3:
        if (this.platform.is('cordova')) {
          this.boardActiveService.generateHeaders().then(headers => {
            alert(`${JSON.stringify(headers, null, 2)}`);
          });
        } else {
          alert(`Cordova not present.`);
        }
        break;
      case 4:
        this.utilService.navigate('/ba-user', true);
        break;
      case 5:
        this.utilService.navigate('/ba-custom', true);
        break;
      case 6:
        this.boardActiveService.defaultAttributes().then(data => {
          alert(`${JSON.stringify(data, null, 2)}`);
        });
        break;
    }
  }
  sendWelcomeMessage(type: any) {
    type = type || 1; // default to 1
    this.boardActiveService.welcomeNotification(type);
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

