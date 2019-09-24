import { Component, OnInit, Input, NgZone, ViewChild } from '@angular/core';
import { Platform, NavParams, ModalController, AlertController, IonContent } from '@ionic/angular';
import { UtilService } from '../../../services/util/util.service';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { FCMService } from '../../../services/fcm/fcm.service';
import { MenuController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';

import BackgroundGeolocation, {
  Location,
  HttpEvent,
  HeartbeatEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  ConnectivityChangeEvent
} from '../../../services/cordova-background-geolocation';
import { MessageDto, MessageModel } from 'src/app/models/message.model';

const TRACKER_HOST = 'http://tracker.transistorsoft.com/locations/';

@Component({
  selector: 'app-ba-messages',
  templateUrl: './ba-messages.page.html',
  styleUrls: ['./ba-messages.page.scss'],
})
export class BaMessagesPage implements OnInit {
  @ViewChild(IonContent, null) content: IonContent;
  public development: boolean = false;
  public isRendering: boolean = true;
  public developer: boolean = false;
  public easteregg: number = 0;
  
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

  searchTerm : any = '';
  events: any;

  // UI State
  menuActive: boolean;
  motionActivity: string;
  odometer: string;

  messages: MessageDto[];

  showLog: boolean = false;

  constructor(
    private baService: BoardActiveService,
    private utilService: UtilService,
    private FCMService: FCMService,
    private menuCtrl: MenuController,
    private platform: Platform,
    private zone: NgZone,
    private device: Device,
    private localStorageService: LocalStorageService,
    private alertController: AlertController
  ) {

    this.events = [];

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        console.log(`onDeviceReady: ${null}`)
        this.onDeviceReady.bind(this)
        this.onDeviceReady();  
      }
    });

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
    this.localStorageService.getItem('environment').subscribe(data => {
      console.log(`environment: ${data}`)
      this.addEvent('environment: ', new Date(), data);
      if (data === 'dev') {
        this.development = true;
      }
    });

    this.baService.init().then(response => {
      console.log(`init(): ${JSON.stringify(response, null, 2)}`);
      this.baService.postMe().subscribe(data => {
        console.log(`postMe(): ${JSON.stringify(data, null, 2)}`);
        this.addEvent('postMe()', new Date(), data);
      });
    });

    if (this.platform.is('cordova')) {
      BackgroundGeolocation.start((state) => {
        console.log(`- Start success: ${JSON.stringify(state, null, 2)}`);
        this.addEvent('BackgroundGeolocation()', new Date(), state);
      });
    }

    this.getData();

  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }


  getEvents(ev: any) {
    this.getData();
    let serVal = ev.target.value;
    if (serVal && serVal.trim() != '') {
      this.events = this.events.filter((data) => {
        return (data.toLowerCase().indexOf(serVal.toLowerCase()) > -1);
      })
    }
  }

  signOut() {
    this.localStorageService.removeItem('auth');
    this.localStorageService.removeItem('apps');
    this.localStorageService.removeItem('appId');
    this.utilService.navigate('/login', false);
  }

  switchApp() {
    this.utilService.navigate('/ba-apps', false);
  }

  onDeviceReady() {
    console.log(`- configureBackgroundGeolocation:`);
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


  /**
* @event location
*/
  onLocation(location: Location) {
    console.log('[event] location: ', location);
    const event = location.event || 'location';

    this.zone.run(() => {
      this.odometer = (location.odometer / 1000).toFixed(1) + 'km';
      const lat: any = location.coords.latitude.toString();
      const lng: any = location.coords.longitude.toString();
      this.addEvent(event, new Date(location.timestamp), location);
      // this.baService.handleLocationUpdate(lat, lng);
      this.baService.postLocation(lat, lng).subscribe((res) => {
        const eventMsg = 'BA Location: response';
        this.addEvent(eventMsg, new Date(location.timestamp), res);
      });
    });
  }
  /**
  * @event motionchange
  */
  onMotionChange(event: MotionChangeEvent) {
    console.log('[event] motionchange, isMoving: ', event.isMoving, ', location: ', event.location);
    this.zone.run(() => {
      this.isMoving = event.isMoving;
    });
  }
  /**
  * @event activitychange
  */
  onActivityChange(event: MotionActivityEvent) {
    console.log('[event] activitychange: ', event);
    this.zone.run(() => {
      this.addEvent('activitychange', new Date(), `${event.activity}:${event.confidence}%`);
      this.motionActivity = `${event.activity}:${event.confidence}%`;
    });
  }
  /**
  * @event http
  */
  onHttpSuccess(response: HttpEvent) {
    console.log('[event] http: ', response);
    this.zone.run(() => {
      this.addEvent('http', new Date(), response);
    });
  }
  onHttpFailure(response: HttpEvent) {
    console.warn('[event] http failure: ', response);
    this.zone.run(() => {
      this.addEvent('http failure', new Date(), response);
    });
  }
  /**
  * @event heartbeat
  */
  onHeartbeat(event: HeartbeatEvent) {
    const location = event.location;
    // NOTE:  this is merely the last *known* location.  It is not the *current* location.  If you want the current location,
    // fetch it yourself with #getCurrentPosition here.
    console.log('- heartbeat: ', location);
  }
  /**
  * @event providerchange
  */
  onProviderChange(provider: ProviderChangeEvent) {
    console.log('[event] providerchange', provider);
    this.zone.run(() => {
      this.addEvent('providerchange', new Date(), provider);
    });
  }
  /**
  * @event powersavechange
  */
  onPowerSaveChange(isPowerSaveEnabled: boolean) {
    console.log('[event] powersavechange', isPowerSaveEnabled);
    this.zone.run(() => {
      this.addEvent('powersavechange', new Date(), { isPowerSaveEnabled: isPowerSaveEnabled });
    });
  }
  /**
  * @event connectivitychange
  */
  onConnectivityChange(event: ConnectivityChangeEvent) {
    console.log('[event] connectivitychange connected? ', event.connected);
  }

  /**
  * Add a record to ion-list
  * @ param {String} event name
  * @ param {Date} date
  * @ param {Object} event object, eg: {location}, {provider}, {activity}
  */
  private addEvent(name, date, event) {
    const timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    this.events.unshift({
      name: name,
      timestamp: timestamp,
      object: event,
      content: JSON.stringify(event, null, 2)
    });
  }


  getMe() {
    this.baService.getMe().subscribe(response => {
      console.log(JSON.stringify(response, null, 2));
    });
  }

  putMe() {
    this.baService.putMe().subscribe(response => {
      console.log(JSON.stringify(response, null, 2));
    });
  }

  postMe() {
    this.baService.postMe().subscribe(response => {
      console.log(JSON.stringify(response, null, 2));
    });
  }

  testGetRestApi(headers: boolean) {
    this.baService.testGetRestApi(headers).then(response => {
      console.log(`testGetRestApi: ${JSON.stringify(response, null, 2)}`);
    });
  }

  getData() {
    // this.localStorageService.getItem('msg').subscribe(data => {
    //   console.log(`msg: ${JSON.stringify(data, null, 2)}`);
    // });

   this.localStorageService.getItem('messages').subscribe(data => {
      this.messages = data;
      console.log(`getData() messages: ${JSON.stringify(this.messages, null, 2)}`);      
    });
  }

  clearMsg() {
    if(this.showLog) {
      this.events = [];
    } else {
      this.localStorageService.removeItem('msgCnt');
      this.localStorageService.removeItem('msg');
      this.localStorageService.removeItem('messages');
      this.getData();  
    }
    console.log(`All Data Cleared`);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getData();
    console.log(`data: ${JSON.stringify(this.messages, null, 2)}`);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  startLocation() {
    this.platform.ready().then(() => {
      console.log(`onDeviceReady: ${null}`)
      this.onDeviceReady.bind(this)
    });

    BackgroundGeolocation.start((state) => {
      console.log(`- Start success: ${JSON.stringify(state, null, 2)}`);
      this.addEvent('BackgroundGeolocation()', new Date(), state);
    });
  }

  openMessage(item: any) {
    console.log(`openMessage: ${JSON.stringify(item, null, 2)}`);
    this.baService.modalMessage(item);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Clear Data.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.clearMsg();
          }
        }
      ]
    });

    await alert.present();
  }

  viewLog(show: boolean) {
    this.showLog = show;
  }

  developerMode() {
    this.easteregg = this.easteregg + 1;
    if (this.easteregg === 7) {
      this.development = true;
      this.easteregg = 0;
    } else {
      this.development = false;
    }
  }

}
