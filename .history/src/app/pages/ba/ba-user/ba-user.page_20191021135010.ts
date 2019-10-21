import { Component, OnInit } from '@angular/core';

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

constructor() { }

  ngOnInit() {
  }

  save() {

  }
}
