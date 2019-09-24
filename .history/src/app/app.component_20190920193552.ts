import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
      active: false
    },
    {
      title: 'Device',
      icon: 'wallet'
    },
    {
      title: 'App Variables',
      icon: 'time'
    },
    {
      title: 'Basic Notification',
      icon: 'notifications'
    },
    {
      title: 'Big Picture Notification',
      icon: 'notifications'
    },
    {
      title: 'Action Button Notification',
      icon: 'notifications'
    },
    {
      title: 'Big Text Notification',
      icon: 'notifications'
    },
    {
      title: 'Inbox Style Notification',
      icon: 'notifications'
    }
  ];



  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
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
    alert(`${item.title}`)
  }
}
