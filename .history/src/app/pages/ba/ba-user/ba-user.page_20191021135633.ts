import { Component, OnInit } from '@angular/core';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';

interface userAttributes {
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
stock: userAttributes;

constructor(
  private boardActiveService: BoardActiveService
) { 

}

  ngOnInit() {
    this.boardActiveService.putMe().subscribe(data => {
      const user: any = data;
      this.stock = user.userAttributes;
    })
  }

  save() {
    this.boardActiveService.putMe(this.stock).subscribe(data => {
      const user: any = data;
      this.stock = user.userAttributes;
    })
  }
}
