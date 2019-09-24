import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util/util.service';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { AppDto } from 'src/app/models/app.model';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { FCMService } from '../../../services/fcm/fcm.service';

@Component({
  selector: 'app-ba-messages',
  templateUrl: './ba-messages.page.html',
  styleUrls: ['./ba-messages.page.scss'],
})
export class BaMessagesPage implements OnInit {
public development: boolean = false;

  constructor(
    private baService: BoardActiveService,
    private storage: Storage,
    private utilService: UtilService,
    private FCMService: FCMService
  ) { 

  }

  ngOnInit() {
    this.storage.get('environment').then(data => {
      console.log(`environment: ${data}`)
      if(data === 'dev') {
        this.development = true;
      }

    });

    this.baService.init().then(response => {
      this.baService.putMe().then(data => {
        
      });  
    });

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
