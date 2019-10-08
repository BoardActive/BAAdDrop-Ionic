import { Component, OnInit, NgZone, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UtilService } from '../../../services/util/util.service';
import { Device } from '@ionic-native/device/ngx';
import BackgroundGeolocation, {
  Location,
  HttpEvent,
  HeartbeatEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  ConnectivityChangeEvent
} from '../../../services/cordova-background-geolocation';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';

// Google maps <script> is loaded in main index.html
declare var google;

import COLORS from '../../../../lib/colors';
import SOUND_MAP from '../../../../lib/sound-map';

// Google maps <script> is loaded in main index.html
declare var google;

// Transistor Software Tracking Server Host
const TRACKER_HOST = 'http://tracker.transistorsoft.com/locations/';



@Component({
  selector: 'app-ba-map',
  templateUrl: './ba-map.page.html',
  styleUrls: ['./ba-map.page.scss'],
})
export class BaMapPage implements OnInit, AfterViewInit {
  @ViewChild('map', {static: false}) mapElement: ElementRef;

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

  // UI State
  menuActive: boolean;
  motionActivity: string;
  odometer: string;

  // Google Map references
  map: any;
  locationMarkers: any;
  currentLocationMarker: any;
  lastLocation: any;
  stationaryRadiusCircle: any;
  polyline: any;



  constructor(
    private utilService: UtilService,
    private platform: Platform,
    private zone: NgZone,
    private device: Device,
    private baService: BoardActiveService
  ) { 
    this.platform.ready().then(this.onDeviceReady.bind(this));

    this.state = {};
    // BackgroundGeolocation initial config.
    this.isMoving = false;
    this.enabled = false;
    this.autoSync = true;
    this.distanceFilter = 10;
    this.stopTimeout = 1;
    this.stopOnTerminate = false;
    this.startOnBoot = true;
    this.debug = false;

    // UI members.
    this.motionActivity = 'Activity';
    this.menuActive = false;

  }

  ngOnInit() {
    this.baService.init().then(response => {
      console.log(`init(): ${JSON.stringify(response, null, 2)}`);
      this.baService.putMe().subscribe(data => {
        console.log(`putMe(): ${JSON.stringify(data, null, 2)}`);
      });
    });
  }
  


  ionViewDidLoad() {
  }

  ngAfterViewInit() {
    console.log('ionViewDidLoad HomePage');
    this.configureMap();
    this.configureBackgroundGeolocation();
  }

  onDeviceReady() {
    // We prompt you for a unique identifier in order to post locations tracker.transistorsoft.com
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
        this.enabled         = state.enabled;
        this.isMoving        = state.isMoving;
        this.autoSync        = state.autoSync;
        this.distanceFilter  = state.distanceFilter;
        this.stopTimeout     = state.stopTimeout;
        this.stopOnTerminate = state.stopOnTerminate;
        this.startOnBoot     = state.startOnBoot;
        this.debug           = state.debug;
      });
    });
  }

  /**
  * @event location
  */
  onLocation(location:Location) {
    console.log('[event] location ', location);
    const lat: any = location.coords.latitude.toString();
    const lng: any = location.coords.longitude.toString();

    this.zone.run(() => {
      this.odometer = (location.odometer/1000).toFixed(1) + 'km';
      this.baService.postLocation(lat, lng).subscribe((res) => {
        const eventMsg = 'BA Location: response';
      });
    });

    this.updateCurrentLocationMarker(location);
  }
  /**
  * @event motionchange
  */
  onMotionChange(event:MotionChangeEvent) {
    console.log('[event] motionchange, isMoving: ', event.isMoving, event.location);

    this.zone.run(() => {
      this.isMoving = event.isMoving;
    });

    // Show / hide the big, red stationary radius circle
    if (!event.isMoving) {
      let coords = event.location.coords;
      let radius = 200;
      let center = new google.maps.LatLng(coords.latitude, coords.longitude);

      this.stationaryRadiusCircle.setRadius(radius);
      this.stationaryRadiusCircle.setCenter(center);
      this.stationaryRadiusCircle.setMap(this.map);
      this.map.setCenter(center);
    } else if (this.stationaryRadiusCircle) {
      this.stationaryRadiusCircle.setMap(null);
    }
  }
  /**
  * @event activitychange
  */
  onActivityChange(event:MotionActivityEvent) {
    console.log('[event] activitychange: ', event);
    this.zone.run(() => {
      this.motionActivity = `${event.activity}:${event.confidence}%`;
    });
  }
  /**
  * @event http
  */
  onHttpSuccess(response:HttpEvent) {
    console.log('[event] http: ', response);
  }
  onHttpFailure(response:HttpEvent) {
    console.warn('[event] http failure: ', response);
  }

  /**
  * @event heartbeat
  */
  onHeartbeat(event:HeartbeatEvent) {
    let location = event.location;
    // NOTE:  this is merely the last *known* location.  It is not the *current* location.  If you want the current location,
    // fetch it yourself with #getCurrentPosition here.
    console.log('- heartbeat: ', location);
  }
  /**
  * @event powersavechange
  */
  onPowerSaveChange(isPowerSaveEnabled) {
    // this.dialogs.alert('[event] powersavechnage, Power-save mode enabled? ' + isPowerSaveEnabled);
    console.log('[event] powersavechange, isPowerSaveEnabled: ', isPowerSaveEnabled);
  }
  onConnectivityChange(event:ConnectivityChangeEvent) {
    console.log('[event] connectivitychange, connected? ', event.connected);
    this.toast('[event] connectivitychange: Network connected? ', event.connected);
  }
  /**
  * @event providerchange
  */
  onProviderChange(provider:ProviderChangeEvent) {
    this.provider = provider;
    console.log('[event] providerchange: ', provider);
  }

  onClickMainMenu(item) {
    this.menuActive = !this.menuActive;
    this.playSound((this.menuActive) ? 'OPEN' : 'CLOSE');
  }

  onClickSync() {
    this.hasRecords().then((count) => {
      this.confirm(`Sync ${count} records to server?`).then(this.doSync.bind(this));
    });
  }

  private doSync() {
    BackgroundGeolocation.sync((records) => {
      this.toast(`Synced ${records.length} records to server.`);
      console.log('- #sync success: ', records.length);
    }, (error) => {
      console.warn('- #sync failure: ', error);
    });
  }

  onClickDestroy() {
    this.hasRecords().then((count) => {
      this.confirm(`Destroy ${count} records?`).then(this.doDestroyLocations.bind(this));
    }).catch(() => {
      this.toast('Database is empty');
    });
  }

  private doDestroyLocations() {
    BackgroundGeolocation.destroyLocations(() => {
      this.toast('Destroyed all records');
      console.log('- #destroyLocations success');
    }, (error) => {
      console.warn('- #destroyLocations error: ', error);
    });
  }

  private hasRecords() {
    return new Promise((resolve, reject) => {
      BackgroundGeolocation.getCount((count) => {
        if (count > 0) {
          resolve(count);
        } else {
          this.toast('Database is empty');
        }
      });
    });
  }

  onClickEmailLog() {
    this.getEmail().then((email) => {
      this.confirm(`Email logs to ${email}?`).then(() => {
        this.doEmailLog(email);
      }).catch(() => {
        // Clear email from localStorage and redo this action.
        let localStorage = (<any>window).localStorage;
        localStorage.removeItem('email');
        this.onClickEmailLog();
      });
    });
  }

  private doEmailLog(email) {
    // Show spinner
    // let loader = this.loadingCtrl.create({content: "Creating log file..."});
    // loader.present();

    BackgroundGeolocation.emailLog(email, () => {
      // loader.dismiss();
    }, (error) => {
      // loader.dismiss();
      console.warn('#emailLog error: ', error);
    });
  }

  onClickDestroyLog() {
    this.confirm("Destroy logs?").then(this.doDestroyLog.bind(this));
  }

  private doDestroyLog() {
    // let loader = this.loadingCtrl.create({content: "Destroying logs..."});
    // loader.present();

    BackgroundGeolocation.destroyLog(() => {
      // loader.dismiss();
      this.toast('Destroyed logs');
    }, (error) => {
      // loader.dismiss();
      this.toast('Destroy logs failed: ' + error);
    });
  }

  onSetConfig(name) {
    if (this.state[name] === this[name]) {
      // No change.  do nothing.
      return;
    }
    // Careful to convert string -> number from <ion-input> fields.
    switch(name) {
      case 'distanceFilter':
      case 'stopTimeout':
        this[name] = parseInt(this[name], 10);
        break;
    }
    // Update state
    this.state[name] = this[name];
    let config = {};
    config[name] = this[name];

    // #setConfig

    BackgroundGeolocation.setConfig(config, (state) => {
      this.toast(`#setConfig ${name}: ${this[name]}`);
    });
  }

  /**
  * [Home] button clicked.  Goo back to home page
  */
  onClickHome() {
    this.utilService.navigate('/messages', false);
  }

  /**
  * #start / #stop tracking
  */
  onToggleEnabled() {
    console.log('- enabled: ', this.enabled);

    if (this.enabled) {
      BackgroundGeolocation.start((state) => {
        console.log('- Start success: ', state);
      });
    } else {
      this.isMoving = false;
      this.stationaryRadiusCircle.setMap(null);
      BackgroundGeolocation.stop((state) => {
        console.log('- Stop success: ', state);
      });
    }
  }
  /**
  * Toggle moving / stationary state
  */
  onClickChangePace() {
    if (!this.enabled) {
      this.toast('You cannot changePace while plugin is stopped');
      return;
    }
    this.isMoving = !this.isMoving;

    BackgroundGeolocation.changePace(this.isMoving, () => {
      console.log('- changePace success');
    });
  }
  /**
  * Get the current position
  */
  onClickGetCurrentPosition() {
    BackgroundGeolocation.getCurrentPosition({}, (location) => {
      console.log('- getCurrentPosition success: ', location);
    });
  }

  /**
  * Configure the google map
  */
  private configureMap() {
    /**
    * Configure Google Maps
    */
    this.locationMarkers = [];

    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      panControl: false,
      rotateControl: false,
      scaleControl: false,
      streetViewControl: false,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Blue current location marker
    this.currentLocationMarker = new google.maps.Marker({
      zIndex: 10,
      map: this.map,
      title: 'Current Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: COLORS.blue,
        fillOpacity: 1,
        strokeColor: COLORS.white,
        strokeOpacity: 1,
        strokeWeight: 6
      }
    });

    // Red Stationary Geofence
    this.stationaryRadiusCircle = new google.maps.Circle({
      zIndex: 0,
      fillColor: COLORS.red,
      strokeColor: COLORS.red,
      strokeWeight: 1,
      fillOpacity: 0.3,
      strokeOpacity: 0.7,
      map: this.map
    });
    // Route polyline
    this.polyline = new google.maps.Polyline({
      map: this.map,
      zIndex: 1,
      geodesic: true,
      strokeColor: COLORS.polyline_color,
      strokeOpacity: 0.7,
      strokeWeight: 7,
      icons: [{
        repeat: '30px',
        icon: {
          path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
          scale: 1,
          fillOpacity: 0,
          strokeColor: COLORS.white,
          strokeWeight: 1,
          strokeOpacity: 1
        }
      }]
    });
  }

  /**
  * Update the lat/lng of blue current location marker
  */
  private updateCurrentLocationMarker(location) {
    var latlng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    this.currentLocationMarker.setPosition(latlng);

    setTimeout(() => {
      this.map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
    });

    if (location.sample === true) {
      return;
    }
    if (this.lastLocation) {
      this.locationMarkers.push(this.buildLocationMarker(location));
    }
    // Add breadcrumb to current Polyline path.
    this.polyline.getPath().push(latlng);
    this.lastLocation = location;
  }

  /**
  * Build a new Google Map location marker with direction icon
  */
  private buildLocationMarker(location, options?) {
    options = options || {};

    return new google.maps.Marker({
      zIndex: 1,
      icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        rotation: location.coords.heading,
        scale: 2,
        anchor: new google.maps.Point(0, 2.6),
        fillColor: COLORS.polyline_color,
        fillOpacity: 1,
        strokeColor: COLORS.black,
        strokeWeight: 1,
        strokeOpacity: 1
      },
      map: this.map,
      position: new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
    });
  }

  /**
  * Fetch email address from localStorage.  We use this for #emailLog method
  * @return Promise
  */
  private getEmail() {
    let localStorage = (<any>window).localStorage;
    let email = localStorage.getItem('email');

    return new Promise((resolve, reject) => {
      if (email) { return resolve(email); }
      // this.dialogs.prompt('Email address', 'Email Logs').then((response) => {
        // if (response.buttonIndex === 1 && response.input1.length > 0) {
        //   let email = response.input1;
        //   localStorage.setItem('email', email);
        //   resolve(email);
        // }
      // });
    });
  }

  /**
  * Send a Toast message
  */
  private toast(message, duration?) {
    // this.toastCtrl.create({
    //   message: message,
    //   cssClass: 'toast',
    //   duration: duration || 3000
    // }).present();
  }

  /**
  * Confirm stuff
  */
  private confirm(message) {
    return new Promise((resolve, reject) => {
      // let alert = this.alertCtrl.create({
      //   title: 'Confirm',
      //   message: message,
      //   buttons: [{
      //     text: 'Cancel',
      //     role: 'cancel'
      //   }, {
      //     text: 'Confirm',
      //     handler: resolve
      //   }]
      // });
      // alert.present();
    });
  }

  /**
  * Play a UI sound via BackgroundGeolocation#playSound
  */
  private playSound(name) {
    let soundId = SOUND_MAP[this.device.platform.toUpperCase()][name.toUpperCase()];
    if (!soundId) {
      console.warn('playSound: Unknown sound: ', name);
    }
    BackgroundGeolocation.playSound(soundId);
  }
}