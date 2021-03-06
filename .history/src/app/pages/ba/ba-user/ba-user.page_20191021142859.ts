import { Component, OnInit, ɵɵi18nAttributes } from '@angular/core';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { UtilService } from '../../../services/util/util.service';

export class attributes {
  name: any;
  email: any;
  phone: any;
  dateBorn: any;
  gender: any;
  facebookUrl: any;
  linkedInUrl: any;
  twitterUrl: any;
  instagramUrl: any;
  avatarUrl: any;
}

@Component({
  selector: 'app-ba-user',
  templateUrl: './ba-user.page.html',
  styleUrls: ['./ba-user.page.scss'],
})
export class BaUserPage implements OnInit {
stock: attributes = new attributes();

constructor(
  private boardActiveService: BoardActiveService,
  private utilService: UtilService
) { 

}

  ngOnInit() {
    this.boardActiveService.putMe().subscribe(data => {
      console.log(`user: ${JSON.stringify(data, null, 2)}`);
      const user: any = data;
      this.stock = user.attributes.stock;
      console.log(`user.attributes.stock: ${JSON.stringify(user.attributes.stock, null, 2)}`);
    })
  }

  save() {
    this.boardActiveService.putMe(this.stock).subscribe(data => {
      console.log(`user: ${JSON.stringify(data, null, 2)}`);
      this.utilService.navigate('/ba-messages', false);

    })
  }
}
