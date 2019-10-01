import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { UtilService } from '../../../services/util/util.service';
import { AppDto } from 'src/app/models/app.model';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { Storage } from '@ionic/storage';

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
    private menuCtrl: MenuController, 
    private localStorageService: LocalStorageService,
    private storage: Storage

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
    if (this.email === 'tom@axiomaim.com') {
      this.developer = true;
      console.log(`developer: ${this.developer}`)
    }

    if(this.developer) {
      this.localStorageService.setItem('environment', 'dev').subscribe(() => {
        console.log(`dev: ${this.developer}`)
      });
    } else {
      this.localStorageService.setItem('environment', 'prod').subscribe(() => {
        console.log(`prod: ${this.developer}`)
      });
    }

    this.localStorageService.setItem('AppTest', '1').subscribe(() => {
        
    });

    this.localStorageService.setItem('UserEmail', this.email).subscribe(() => {
        
    });

    this.localStorageService.setItem('UserPassword', this.password).subscribe(() => {
        
    });

    this.baService.postLogin(this.email, this.password).subscribe(response => {
      const appModel: AppDto = response;
      if (appModel.apps) {
        this.storage.set('auth', true).then(() => {
          this.localStorageService.setItem('apps', appModel).subscribe(() => {
            if(appModel.apps.length === 1) {
              this.localStorageService.setItem('AppID', appModel.apps[0].id).subscribe(() => {
                this.utilService.navigate('/ba-messages', false);        
              });
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
