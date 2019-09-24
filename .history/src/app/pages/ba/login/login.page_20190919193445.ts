import { Component, OnInit } from '@angular/core';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { UtilService } from '../../../services/util/util.service';
import { Storage } from '@ionic/storage';
import { AppDto } from 'src/app/models/app.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
public email: any;
public password: any;

  constructor(
    private baService: BoardActiveService,
    private utilService: UtilService,
    private storage: Storage
  ) {

   }

  ngOnInit() {
  }

  signIn() {
    this.baService.postLogin(this.email, this.password).subscribe(response => {
      const appModel: AppDto = response;
      if (appModel.apps) {
        this.storage.set('auth', true).then(() => {
          this.storage.set('apps', response).then(() => {
            if(appModel.apps.length === 1) {
              this.storage.set('appId', appModel.apps[0].id);
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

}
