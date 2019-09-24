import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BoardActiveService } from './services/boardactive/board-active.service';
import { Storage } from '@ionic/storage';

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
      title: 'Device',
      icon: 'wallet',
      menuItem: 2
    },
    {
      title: 'App Variables',
      icon: 'time',
      menuItem: 3
    },
    {
      title: 'Basic Notification',
      icon: 'notifications',
      menuItem: 4
    },
    {
      title: 'Big Picture Notification',
      icon: 'notifications',
      menuItem: 5
    },
    {
      title: 'Action Button Notification',
      icon: 'notifications',
      menuItem: 6
    },
    {
      title: 'Big Text Notification',
      icon: 'notifications',
      menuItem: 7
    },
    {
      title: 'Inbox Style Notification',
      icon: 'notifications',
      menuItem: 8

    }
  ];



  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private baService: BoardActiveService,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    localStorage.setItem('environment', 'dev');
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  menuAction(item: any) {
    switch (item.menuItem) {
      case 1:
        this.storage.get('token').then(token => {
          alert(`${token}`);
        });
        break;
      case 2:
        this.baService.postMe().then(vars => {
          alert(`${JSON.stringify(vars, null, 2)}`);
        });
        break;
      case 3:
        this.baService.generateHeaders().then(headers => {
          alert(`${JSON.stringify(headers, null, 2)}`);
        });
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
    }
    alert(`${item.title}`)
  }
}
