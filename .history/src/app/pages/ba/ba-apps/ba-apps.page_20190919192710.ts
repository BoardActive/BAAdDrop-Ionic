import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UtilService } from '../../../services/util/util.service';

@Component({
  selector: 'app-ba-apps',
  templateUrl: './ba-apps.page.html',
  styleUrls: ['./ba-apps.page.scss'],
})
export class BaAppsPage implements OnInit {

  constructor(
    private storage: Storage,
    private utilService: UtilService
  ) { }

  ngOnInit() {
  }

  signOut() {
    this.storage.remove('auth');
    this.storage.remove('apps');
    this.utilService.navigate('/login', false);
  }
}
