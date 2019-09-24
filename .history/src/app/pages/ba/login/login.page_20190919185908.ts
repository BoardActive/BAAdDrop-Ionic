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
    this.baService.postLogin(this.email, this.password).subscribe(resp => {
      console.log(`status: ${resp.status}`);
      const appModel: AppDto = resp;
      if (appModel.apps) {
        if(appModel.apps.length === 1) {
          alert(`${appModel.apps[0].name}`);
        } else {
          alert(`${JSON.stringify(appModel.apps, null, 2)}`);
        }
      }
    });
  }

}
