import { Component, OnInit } from '@angular/core';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';

export interface attributes {
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
stock: attributes;

constructor(
  private boardActiveService: BoardActiveService
) { 

}

  ngOnInit() {
    this.boardActiveService.putMe().subscribe(data => {
      console.log(`user: ${JSON.stringify(data, null, 2)}`);
      const user: any = data;
      this.stock = user.attributes.stock;
      console.log(`user.attributes: ${JSON.stringify(user.attributes, null, 2)}`);
    })
  }

  save() {
    this.boardActiveService.putMe(this.stock).subscribe(data => {
      console.log(`user: ${JSON.stringify(data, null, 2)}`);
      const user: any = data;
    })
  }
}
