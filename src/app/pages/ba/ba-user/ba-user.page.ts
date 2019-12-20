import { Component, OnInit } from '@angular/core';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { UtilService } from '../../../services/util/util.service';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-ba-user',
  templateUrl: './ba-user.page.html',
  styleUrls: ['./ba-user.page.scss'],
})
export class BaUserPage implements OnInit {
  stockAttributes: any = [];
  customAttributes: any = [];

constructor(
  private boardActiveService: BoardActiveService,
  private utilService: UtilService,
  private localStorageService: LocalStorageService
) { 

}

  ngOnInit() {
    this.boardActiveService.putMe().then(data => {
      console.log(`user: ${JSON.stringify(data, null, 2)}`);
      const user: any = data;
      this.stockAttributes = user.attributes.stock;
      this.customAttributes = user.attributes.custom;
      console.log(`user.attributes.stock: ${JSON.stringify(user.attributes.stock, null, 2)}`);
    });
  }

  save() {
    this.boardActiveService.putMe(this.stockAttributes, this.customAttributes).then(data => {
      console.log(`user: ${JSON.stringify(data, null, 2)}`);
      this.utilService.navigate('/ba-messages', false);
    });
  }

  cancel() {
    this.utilService.navigate('/ba-messages', false);
  }
}
