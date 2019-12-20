import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { BoardActiveService } from './services/boardactive/board-active.service';
import { FCMService } from './services/fcm/fcm.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LocalStorageService } from './services/local-storage/local-storage.service';

import { BaMessagePageModule } from './pages/ba/ba-message/ba-message.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  exports: [],
  entryComponents: [
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    BaMessagePageModule    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BoardActiveService,
    AppVersion,
    Device,
    Diagnostic,
    FirebaseX,
    FCMService,
    LocalNotifications,
    LocalStorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
