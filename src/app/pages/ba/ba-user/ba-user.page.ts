import { Component, OnInit, ɵɵi18nAttributes } from '@angular/core';
import { BoardActiveService, Attributes } from '../../../services/boardactive/board-active.service';
import { UtilService } from '../../../services/util/util.service';

@Component({
  selector: 'app-ba-user',
  templateUrl: './ba-user.page.html',
  styleUrls: ['./ba-user.page.scss'],
})
export class BaUserPage implements OnInit {
stock: Attributes = new Attributes;

constructor(
  private boardActiveService: BoardActiveService,
  private utilService: UtilService
) { 

}

  ngOnInit() {
    this.boardActiveService.putMe().then(data => {
      console.log(`user: ${JSON.stringify(data, null, 2)}`);
      const user: any = data;
      this.stock = user.attributes.stock;
      console.log(`user.attributes.stock: ${JSON.stringify(user.attributes.stock, null, 2)}`);
    })
  }

  save() {
    this.boardActiveService.putMe(this.stock).then(data => {
      console.log(`user: ${JSON.stringify(data, null, 2)}`);
      this.utilService.navigate('/ba-messages', false);

    })
  }

  cancel() {
    this.utilService.navigate('/ba-messages', false);
  }
}
