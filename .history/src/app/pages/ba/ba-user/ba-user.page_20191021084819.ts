import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ba-user',
  templateUrl: './ba-user.page.html',
  styleUrls: ['./ba-user.page.scss'],
})
export class BaUserPage implements OnInit {

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


  constructor() { }

  ngOnInit() {
  }

}
