import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util/util.service';
import { AppDto } from 'src/app/models/app.model';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-ba-messages',
  templateUrl: './ba-messages.page.html',
  styleUrls: ['./ba-messages.page.scss'],
})
export class BaMessagesPage implements OnInit {

  constructor(
    private storage: Storage,
    private utilService: UtilService
  ) { }

  ngOnInit() {
  }

  signOut() {
    this.storage.remove('auth');
    this.storage.remove('apps');
    this.storage.remove('appId');
    this.utilService.navigate('/login', false);
  }

  switchApp() {
    this.utilService.navigate('/ba-apps', false);
  }

  removeAll() {
    
  }

}
