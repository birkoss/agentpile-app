import { Component } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, NavParams } from 'ionic-angular';

import { EditSessionPage } from '../../pages/edit-session/edit-session';
import { SessionCompletedPage } from '../../pages/session-completed/session-completed';

import { DataProvider } from '../../providers/data/data'
import { SyncProvider } from '../../providers/sync/sync'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  max: number = 100;
  radius: number = 125;
  color: string = '#FAB73A';

  user:any;

  listMode:string = "normal";

  constructor(private alertCtrl:AlertController, private dataProvider:DataProvider, private menuCtrl:MenuController, private modalCtrl:ModalController, private navCtrl:NavController, private navParams:NavParams, private syncProvider:SyncProvider) {
    
    this.user = this.dataProvider.getUsers().find(single_user => single_user['id'] == this.navParams.get("userId"));

    this.max = this.user['sessions'];

    // @TODO: Add a reminder after X days without interaction (only one if the app is not ran again)
    // @TODO: Add the timer feature, Add a notification at the end
    // @TODO: Allow synching

    this.dataProvider.setActiveUser(this.user['id']);
  }

  ionViewDidEnter() {
    this.refresh();
  }

  showMenu() {
    this.menuCtrl.open();
  }

  timeSession() {
    alert("TODO");
  }

  refresh() {
    let isCompleted:boolean = (this.getProgression() >= this.max);

    if (isCompleted) {
      this.dataProvider.createArchive(this.user['id']);      
      
      const modal = this.modalCtrl.create(SessionCompletedPage);
      modal.present(); 
    }
  }

  setMode(newMode) {
    this.listMode = newMode;
  }

  sync() {
    this.syncProvider.start();
  }

  addSession() {
    const modal = this.modalCtrl.create(EditSessionPage, {userId:this.user['id'], minutes:this.user['minutes'], callback:this.refresh.bind(this)});
    modal.present();
  }

  editSession(session:object) {
    const modal = this.modalCtrl.create(EditSessionPage, {userId:this.user['id'], minutes:this.user['minutes'], session:session});
    modal.present();
  }

  getProgression():number {
    return this.getSessions().length;
  }

  getSessions():Array<Object> {
    return this.dataProvider.getSessions(this.user['id']);
  }

  getArchives():Array<Object> {
    return this.dataProvider.getArchives(this.user['id']);
  }

  getOverlayStyle() {
    let transform = 'translateY(-50%) translateX(-50%)';

    return {
      'top':  '50%',
      'bottom':  'auto',
      'left': '50%',
      'transform': transform,
      '-moz-transform': transform,
      '-webkit-transform': transform,
      'font-size': this.radius / 3.5 + 'px'
    };
  }

}
