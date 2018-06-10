import { Component } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, NavParams } from 'ionic-angular';

import { NewSessionPage } from '../../pages/new-session/new-session';

import { DataProvider } from '../../providers/data/data'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  max: number = 100;
  radius: number = 125;
  color: string = '#45ccce';

  userId:number;

  user:any;

  listMode:string = "normal";

  constructor(private alertCtrl:AlertController, private dataProvider:DataProvider, private menuCtrl:MenuController, private modalCtrl:ModalController, private navCtrl:NavController, private navParams:NavParams) {
    this.userId = this.navParams.get("userId");
    this.user = this.dataProvider.getUsers().find(single_user => single_user['id'] == this.userId);

    this.max = this.user['sessions'];
  }

  showMenu() {
    this.menuCtrl.open();
  }

  timeSession() {
    alert("TODO");
  }

  refresh() {
    console.log("CHeck if its completed...");
  }

  setMode(newMode) {
    this.listMode = newMode;
  }

  addSession() {
    const modal = this.modalCtrl.create(NewSessionPage, {userId:this.userId, minutes:this.user['minutes'], callback:this.refresh.bind(this)});
    modal.present();
  }

  deleteSession(session) {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Please confirm you want to delete this session : ' + session['bookName'],
      buttons: [{
        text: 'Cancel',
        handler: () => {
          console.log('Disagree clicked');
        }
      },{
        text: 'Delete',
        handler: () => {
          this.dataProvider.removeSession(this.userId, session);
        }
      }]
    });
    confirm.present();
  }

  getProgression():number {
    return this.getSessions().length;
  }

  getSessions():Array<Object> {
    return this.dataProvider.getSession(this.userId);
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
