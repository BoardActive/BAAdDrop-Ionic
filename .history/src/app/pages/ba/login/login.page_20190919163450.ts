import { Component, OnInit } from '@angular/core';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { UtilService } from '../../../services/util/util.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
public email: any;
public password: any;

  constructor(
    private baService: BoardActiveService,
    private utilService: UtilService
  ) {

   }

  ngOnInit() {
  }

}
