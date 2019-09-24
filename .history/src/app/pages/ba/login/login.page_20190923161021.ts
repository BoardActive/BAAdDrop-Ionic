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

    this.localStorageService.getItem('UserEmail').subscribe(email => {
      this.email = email;
    });

    this.localStorageService.getItem('UserPassword').subscribe(password => {
      this.password = password;
    });

  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  signIn() {
    if(this.developer) {
      this.localStorageService.setItem('environment', 'dev');
    } else {
      this.localStorageService.setItem('environment', 'prod');
    }

    this.localStorageService.setItem('AppTest', '1');
    this.localStorageService.setItem('UserEmail', this.email);
    this.localStorageService.setItem('UserPassword', this.password);

    this.baService.postLogin(this.email, this.password).subscribe(response => {
      const appModel: AppDto = response;
      if (appModel.apps) {
        this.localStorageService.setItem('auth', true).subscribe(() => {
          this.localStorageService.setItem('apps', response).subscribe(() => {
            if(appModel.apps.length === 1) {
              this.localStorageService.setItem('AppID', appModel.apps[0].id);
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
