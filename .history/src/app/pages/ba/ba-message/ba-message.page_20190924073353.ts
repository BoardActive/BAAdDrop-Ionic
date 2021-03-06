import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
// import { BoardActiveService } from '../../../services/boardactive/board-active.service';

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

  constructor(
    public sanitizer: DomSanitizer,
    // private baService: BoardActiveService,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.message = this.navParams.get('message');
    console.log(`BaMessagePage: ${JSON.stringify(this.message)}`);
    this.messageData = JSON.parse(this.message.messageData);
    // this.baService.postEvent('opened', this.message.messageId, this.message.notificationId, this.message.isTestMessage);

    // this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.messageData.urlYoutube);

  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log('[BA:message:ionViewDidEnter]');
    this.isRendering = false;

    setTimeout(() => {
      this.isRendering = false;
    }, 50);
  }

  close(){
      this.modalCtrl.dismiss();
  }

  openWindow(url) {
    console.log(`[BA: openWindow()] ${url}`);
    window.open(url,'_system', 'location=yes');
  }

  callNumber(number) {
    console.log(`[BA: callNumber()] ${number}`);
    window.open('tel:' + number,'_system', 'location=yes');
  }

  email(email) {
    console.log(`[BA: email()] ${email}`);
    window.open('mailto:' + email,'_system', 'location=yes');
  }

  mapAddress(address) {
    console.log(`[BA: mapAddress()] ${address}`);
    window.open('http://maps.google.com/?q=' + address,'_system', 'location=yes');
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
