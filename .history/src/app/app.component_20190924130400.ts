import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BoardActiveService } from './services/boardactive/board-active.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appMenu = [
    {
      title: 'View Token',
      icon: 'home',
      menuItem: 1,
      active: false
    },
    {
      title: 'Device Registration',
      icon: 'wallet',
      menuItem: 2
    },
    {
      title: 'App Variables',
      icon: 'time',
      menuItem: 3
    }
  ];

  public notificationMenu = [
    {
      title: 'Basic',
      icon: 'notifications',
      menuItem: 4
    },
    {
      title: 'Big Picture',
      icon: 'notifications',
      menuItem: 5
    },
    {
      title: 'Action Button',
      icon: 'notifications',
      menuItem: 6
    },
    {
      title: 'Big Text',
      icon: 'notifications',
      menuItem: 7
    },
    {
      title: 'Inbox Style',
      icon: 'notifications',
      menuItem: 8

    }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private baService: BoardActiveService,
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
