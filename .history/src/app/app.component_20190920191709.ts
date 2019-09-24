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
      title: 'Basic',
      icon: 'notifications'
    },
    {
      title: 'Big Picture',
      icon: 'notifications'
    },
    {
      title: 'Action Button',
      icon: 'notifications'
    },
    {
      title: 'Big Text',
      icon: 'notifications'
    },
    {
      title: 'Inbox Style',
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
}
