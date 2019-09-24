import { Component, OnInit } from '@angular/core';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { UtilService } from '../../../services/util/util.service';
import { Storage } from '@ionic/storage';
import { AppDto } from 'src/app/models/app.model';
import { FCMService } from '../../../services/fcm/fcm.service';

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
    private FCMService: FCMService
  ) {

   }

  ngOnInit() {
  }

  signIn() {
    if(this.developer) {
      localStorage.setItem('environment', 'dev');
    } else {
      localStorage.setItem('environment', 'prod');
    }

    this.FCMService.getToken().then(token => {
      this.storage.set('token', token);
    });
    
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

  hideDeveloperMode() {
    this.developer = false;
    this.easteregg = 0;
  }

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
