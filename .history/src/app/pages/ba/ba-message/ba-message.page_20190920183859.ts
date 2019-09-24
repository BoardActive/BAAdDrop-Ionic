import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { Platform, NavParams, ModalController, AlertController, IonContent } from '@ionic/angular';
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
  @ViewChild(IonContent, null) content: IonContent;

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
    private navParams: NavParams,
    private platform: Platform
  ) {
    this.platform.ready().then(this.onDeviceReady.bind(this));

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

    BackgroundGeolocation.start((state) => {
      console.log('- Start success: ', state);
    });

  }

  onDeviceReady() {
    this.configureBackgroundGeolocation();
  }

  private configureBackgroundGeolocation() {

    // Compose #url from username
    const localStorage = (<any>window).localStorage;
    const username = localStorage.getItem('username');
    const url = TRACKER_HOST + username;

    ////
    // Step 1:  listen to events
    //
    BackgroundGeolocation.onLocation(this.onLocation.bind(this));
    BackgroundGeolocation.onMotionChange(this.onMotionChange.bind(this));
    BackgroundGeolocation.onActivityChange(this.onActivityChange.bind(this));
    BackgroundGeolocation.onHttp(this.onHttpSuccess.bind(this));
    BackgroundGeolocation.onProviderChange(this.onProviderChange.bind(this));
    BackgroundGeolocation.onHeartbeat(this.onHeartbeat.bind(this));
    BackgroundGeolocation.onPowerSaveChange(this.onPowerSaveChange.bind(this));
    BackgroundGeolocation.onConnectivityChange(this.onConnectivityChange.bind(this));
    ////
    // Step 2:  Initialize the plugin
    //
    BackgroundGeolocation.ready({
      // Geolocation config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,  // <-- highest possible accuracy
      distanceFilter: this.distanceFilter,
      // ActivityRecognition config
      stopTimeout: this.stopTimeout,
      // Application config
      foregroundService: true,
      stopOnTerminate: this.stopOnTerminate,
      heartbeatInterval: 60,
      // HTTP / Persistence config
      url: url,
      params: BackgroundGeolocation.transistorTrackerParams(this.device),
      autoSync: this.autoSync,
      autoSyncThreshold: 0,
      // Logging / Debug config
      debug: this.debug,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE
    }, (state) => {
      console.log('- BackgroundGeolocation ready: ', state);
      // Set current plugin state upon our view.
      this.zone.run(() => {
        this.enabled = state.enabled;
        this.isMoving = state.isMoving;
        this.autoSync = state.autoSync;
        this.distanceFilter = state.distanceFilter;
        this.stopTimeout = state.stopTimeout;
        this.stopOnTerminate = state.stopOnTerminate;
        this.startOnBoot = state.startOnBoot;
        this.debug = state.debug;
      });
    });
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
