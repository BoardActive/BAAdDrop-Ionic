import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UtilService } from '../../../services/util/util.service';
import { AppDto } from 'src/app/models/app.model';

@Component({
  selector: 'app-ba-apps',
  templateUrl: './ba-apps.page.html',
  styleUrls: ['./ba-apps.page.scss'],
})
export class BaAppsPage implements OnInit {
  public appData: AppDto;

  constructor(
    private storage: Storage,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.storage.get('auth').then(auth => {
      console.log(`${auth}`);
      if (auth) {
        this.storage.get('apps').then(data => {
          this.appData = data;
        });
      } else {
        this.signOut();
      }
    });
  }

  signOut() {
    this.storage.remove('auth');
    this.storage.remove('apps');
    this.utilService.navigate('/login', false);
  }
}
