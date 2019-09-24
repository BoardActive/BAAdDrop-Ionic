import { Component, OnInit, Input } from '@angular/core';
import { Platform, NavParams, ModalController, AlertController } from '@ionic/angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import BackgroundGeolocation, {
  Location,
  HttpEvent,
  HeartbeatEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  ConnectivityChangeEvent
} from '../../../services/cordova-background-geolocation';

@Component({
  selector: 'app-ba-message',
  templateUrl: './ba-message.page.html',
  styleUrls: ['./ba-message.page.scss'],
})
export class BaMessagePage implements OnInit {
  public isRendering: boolean = true;

  public message: any;
  public messageData: any;

  public youtubeUrl: SafeResourceUrl;

  // Background Geolocation State
  state: any;
  enabled: boolean;
  isMoving: boolean;
  distanceFilter: number;
  stopTimeout: number;
  autoSync: boolean;
  stopOnTerminate: boolean;
  startOnBoot: boolean;
  debug: boolean;
  provider: any;


  constructor(
    public sanitizer: DomSanitizer,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {

    // BackgroundGeolocation initial config.
    this.isMoving = false;
    this.enabled = true;
    this.autoSync = true;
    this.distanceFilter = 1;
    this.stopTimeout = 1;
    this.stopOnTerminate = false;
    this.startOnBoot = true;
    this.debug = false;

  }

  ngOnInit() {
    this.message = this.navParams.get('message');
    this.messageData = JSON.parse(this.message.messageData);
    this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.messageData.urlYoutube);
  }

  ionViewDidEnter() {
    console.log('[BA:message:ionViewDidEnter]');
    this.isRendering = false;

    setTimeout(() => {
      this.isRendering = false;
    }, 50);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  openWindow(url) {
    console.log(`[BA: openWindow()] ${url}`);
    window.open(url, '_system', 'location=yes');
  }

  callNumber(number) {
    console.log(`[BA: callNumber()] ${number}`);
    window.open('tel:' + number, '_system', 'location=yes');
  }

  email(email) {
    console.log(`[BA: email()] ${email}`);
    window.open('mailto:' + email, '_system', 'location=yes');
  }

  mapAddress(address) {
    console.log(`[BA: mapAddress()] ${address}`);
    window.open('http://maps.google.com/?q=' + address, '_system', 'location=yes');
  }

  showMsg() {
    // this.presentAlert('Message JSON', this.message);
  }

  // presentAlert(title, message) {
  //   let alert = this.alertCtrl.create({
  //     title: title,
  //     message: JSON.stringify(message, null, 2),
  //     buttons: ['Dismiss']
  //   });
  //   alert.present();
  // }

  // private addEvent(name, date, event) {
  //   let timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

  //   this.events.unshift({
  //     name: name,
  //     timestamp: timestamp,
  //     object: event,
  //     content: JSON.stringify(event, null, 2)
  //   });
  // }
}
