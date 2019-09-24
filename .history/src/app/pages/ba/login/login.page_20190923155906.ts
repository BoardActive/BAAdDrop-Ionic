import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { UtilService } from '../../../services/util/util.service';
import { Storage } from '@ionic/storage';
import { AppDto } from 'src/app/models/app.model';
import { FCMService } from '../../../services/fcm/fcm.service';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
public email: any;
public password: any;
public developer: boolean = false;
public easteregg: number = 0;

  constructor(
    private baService: BoardActiveService,
    private utilService: UtilService,
    private storage: Storage,
    private FCMService: FCMService,
    private menuCtrl: MenuController, 
    private localStorageService: LocalStorageService

  ) {
   }

  ngOnInit() {
    this.localStorageService.getItem('environment').subscribe(dev => {
      if(dev === 'dev') {
        this.developer = true;
      } else {
        this.developer = false;
      }
    });

    this.storage.get('UserEmail').then(email => {
      this.email = email;
    });

    this.storage.get('UserPassword').then(password => {
      this.password = password;
    });

  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  signIn() {
    if(this.developer) {
      this.storage.set('environment', 'dev');
    } else {
      this.storage.set('environment', 'prod');
    }

    this.storage.set('AppTest', '1');
    this.storage.set('UserEmail', this.email);
    this.storage.set('UserPassword', this.password);

    this.baService.postLogin(this.email, this.password).subscribe(response => {
      const appModel: AppDto = response;
      if (appModel.apps) {
        this.storage.set('auth', true).then(() => {
          this.storage.set('apps', response).then(() => {
            if(appModel.apps.length === 1) {
              this.storage.set('AppID', appModel.apps[0].id);
              this.utilService.navigate('/ba-messages', false);
            } else {
              this.utilService.navigate('/ba-apps', false);
            }    
          });
        });
      } else {
        alert(`${response.message}`);
      }
    });
  }

  // hideDeveloperMode() {
  //   this.developer = false;
  //   this.easteregg = 0;
  // }

  developerMode() {
    this.easteregg = this.easteregg + 1;
    if (this.easteregg === 7) {
      this.developer = true;
      this.easteregg = 0;
    } else {
      this.developer = false;
    }
  }

}
