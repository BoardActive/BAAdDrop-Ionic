import { Component, OnInit, NgZone, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Platform, Events, AlertController, IonContent } from '@ionic/angular';
import { UtilService } from '../../../services/util/util.service';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
import { MenuController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import BackgroundGeolocation, {
  Location,
  HeartbeatEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  ConnectivityChangeEvent
} from '../../../services/cordova-background-geolocation';
import { MessageDto } from 'src/app/models/message.model';

@Component({
  selector: 'app-ba-messages',
  templateUrl: './ba-messages.page.html',
  styleUrls: ['./ba-messages.page.scss'],
})
export class BaMessagesPage implements OnInit, AfterViewInit {
  // @ViewChild(IonContent, null) content: IonContent;
  @ViewChild('map', { static: false }) mapElement: ElementRef;

  public development: boolean = false;
  public isRendering: boolean = true;
  public developer: boolean = false;
  public easteregg: number = 0;
  public cntNotifications: number = 0;

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

  forground: boolean;
  log_events_run: boolean = true;
  log_events_db: any;

  // UI State
  public menuActive: boolean;
  public motionActivity: string;
  public odometer: string;

  messages: MessageDto[];

  showInbox: boolean = true;
  showLog: boolean = false;
  showMap: boolean = false;

  constructor(
    private baService: BoardActiveService,
    private utilService: UtilService,
    private menuCtrl: MenuController,
    private platform: Platform,
    private zone: NgZone,
    private device: Device,
    private localStorageService: LocalStorageService,
    private alertController: AlertController,
    private events: Events
  ) {
    this.forground = true
    this.log_events_db = [];

    this.addEvent('Start Logging', new Date(), 'Now logging events');

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        console.log(`onDeviceReady: ${null}`)
        this.onDeviceReady.bind(this)
        this.onDeviceReady();
      }
    });

    // BackgroundGeolocation initial config.
    this.state = {};
    this.isMoving = false;
    this.enabled = true;
    this.autoSync = true;
    this.distanceFilter = 10;
    this.stopTimeout = 1;
    this.stopOnTerminate = false;
    this.startOnBoot = true;
    this.debug = false;
    this.odometer = null;

    this.listenToEvents();
  }

  ngOnInit() {
    this.localStorageService.getItem('environment').subscribe(data => {
      console.log(`environment: ${data}`)
      this.addEvent('environment: ', new Date(), data);
      if (data === 'dev') {
        this.development = true;
      }
    });

    this.localStorageService.getItem('UserEmail').subscribe(email => {
      if (email === 'tom@axiomaim.com') {
        this.developer = true;
      }
    })

    this.baService.init().then(response => {
      console.log(`init(): ${JSON.stringify(response, null, 2)}`);
      this.baService.putMe().subscribe(data => {
        console.log(`putMe(): ${JSON.stringify(data, null, 2)}`);
        this.addEvent('putMe()', new Date(), data);
      });
    });

    if (this.platform.is('cordova')) {
      BackgroundGeolocation.start((state) => {
        this.enabled = true;
        console.log(`- Start success: ${JSON.stringify(state, null, 2)}`);
        this.addEvent('BackgroundGeolocation()', new Date(), state);
      });
    }

    this.getData();

  }

  ngAfterViewInit() {
    console.log('ionViewDidLoad HomePage');
    // this.configureMap();
    // this.configureBackgroundGeolocation();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  listenToEvents() {
    this.events.subscribe('notification:receive', () => {
      const eventMsg = 'BA Notification: receive';
      this.localStorageService.getItem('msg').subscribe(response => {
        this.addEvent(eventMsg, new Date(), response);
        this.cntNotifications = this.cntNotifications + 1;
        this.getData();
      });
    });

    this.events.subscribe('notification:tap', () => {
      const eventMsg = 'BA Notification: tap';
      this.localStorageService.getItem('msg').subscribe(response => {
        this.addEvent(eventMsg, new Date(), response);
        this.getData();
      });
    });

    this.events.subscribe('notification:notap', () => {
      const eventMsg = 'BA Notification: notap';
      this.localStorageService.getItem('msg').subscribe(response => {
        this.addEvent(eventMsg, new Date(), response);
        this.getData();
      });
    });

    this.events.subscribe('notification:opened', () => {
      const eventMsg = 'BA Notification: opened';
      this.localStorageService.getItem('msg').subscribe(payload => {
        this.addEvent(eventMsg, new Date(), payload);
        this.baService.postEvent('received', payload.messageId, payload['gcm.message_id'], payload.isTestMessage);
      });
    });
  }

  signOut() {
    this.localStorageService.removeItem('auth');
    this.localStorageService.removeItem('apps');
    this.localStorageService.removeItem('appId');
    this.utilService.navigate('/login', false);
  }

  onDeviceReady() {
    console.log(`- configureBackgroundGeolocation:`);
    this.configureBackgroundGeolocation();
  }

  private configureBackgroundGeolocation() {
    ////
    // Step 1:  listen to log_vents
    //
    BackgroundGeolocation.onLocation(this.onLocation.bind(this));
    BackgroundGeolocation.onMotionChange(this.onMotionChange.bind(this));
    BackgroundGeolocation.onActivityChange(this.onActivityChange.bind(this));
    // BackgroundGeolocation.onHttp(this.onHttpSuccess.bind(this));
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
    console.log('[event] activitychange: ', JSON.stringify(event, null, 2));
    this.zone.run(() => {
      this.addEvent('activitychange', new Date(), `${event.activity}:${event.confidence}%`);
      this.motionActivity = `${event.activity}:${event.confidence}%`;
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
    let log: any;
    if (this.log_events_run) {

      if (this.forground) {
        log = {
          name: name + '+',
          timestamp: timestamp,
          object: event,
          content: JSON.stringify(event, null, 2)
        };
      } else {
        log = {
          name: name + '-',
          timestamp: timestamp,
          object: event,
          content: JSON.stringify(event, null, 2)
        };
      }
    }


    if (this.log_events_run) {
      // this.baService.addLogDB(log).then(logEntries => {
      //   console.log(`logEntries: ${JSON.stringify(logEntries, null, 2)}`);
      //   this.log_events_db = logEntries;
      //   this.log_events_db = this.log_events_db.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      // });
      this.log_events_db.unshift(log);
      // this.log_events_db = this.log_events_db.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  }

  putMe() {
    this.baService.putMe().subscribe(response => {
      console.log(JSON.stringify(response, null, 2));
      this.addEvent('putMe()', new Date(), response);
    });
  }

  testGetRestApi(headers: boolean) {
    this.baService.testGetRestApi(headers).then(response => {
      console.log(`testGetRestApi: ${JSON.stringify(response, null, 2)}`);
    });
  }

  getData() {
    this.localStorageService.getItem('messages').subscribe(data => {
      this.messages = data;
      this.messages = this.messages.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      console.log(`getData() messages: ${JSON.stringify(this.messages, null, 2)}`);
    });
  }

  clearMsg() {
    this.cntNotifications = 0;
    if (this.showLog) {
      const logEntries = [];
      this.localStorageService.setItem('logDB', logEntries).subscribe(() => {
        this.log_events_db = logEntries;
      });

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
    }, 1000);
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
    this.baService.postEvent('opened', item.messageId, item.notificationId, item.isTestMessage);
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

  viewSwap(view: any) {
    switch (view) {
      case 'inbox': {
        this.showInbox = true;
        this.showLog = false;
        this.showMap = false;
        break;
      }
      case 'log': {
        this.showInbox = false;
        this.showLog = true;
        this.showMap = false;
        break;
      }
      case 'map': {
        // this.showInbox = false;
        // this.showLog = false;
        // this.showMap = true;
        this.utilService.navigate('/ba-map', false);
        break;
      }
    }

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

  loggingRun() {
    if (this.log_events_run) {
      this.addEvent('Pause Logging', new Date(), 'Not logging events');
      this.log_events_run = false;
    } else {
      this.log_events_run = true;
      this.addEvent('Start Logging', new Date(), 'Now logging events');
    }
  }




  getLogDB() {
    this.localStorageService.getItem('logDB').subscribe(data => {
      console.log(`getLogDB: ${JSON.stringify(data, null, 2)}`)
      this.log_events_db = data;
      this.log_events_db = this.log_events_db.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    })
  }

  onToggleEnabled() {
    console.log('- enabled: ', this.enabled);

    if (this.enabled) {
      BackgroundGeolocation.start((state) => {
        console.log('- Start success: ', state);
      });
    } else {
      this.isMoving = false;
      BackgroundGeolocation.stop((state) => {
        console.log('- Stop success: ', state);
      });
    }
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
      this.utilService.presentToast(`#setConfig ${name}: ${this[name]}`, null, 'middle', 2000).then(() => {

      });
    });
  }
}
