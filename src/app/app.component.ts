import { Component, ViewChild } from '@angular/core';
import { AlertController, MenuController, ModalController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoadingPage } from '../pages/loading/loading';
import { HomePage } from '../pages/home/home';
import { NewUserPage } from '../pages/new-user/new-user';

import { DataProvider } from '../providers/data/data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoadingPage;

  menuMode:string = "normal";

  constructor(private alertCtrl:AlertController, private dataProvider:DataProvider, private menuCtrl:MenuController, private modalCtrl:ModalController, public platform:Platform, public statusBar:StatusBar, public splashScreen:SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  loadUser(user) {
    console.log(user);
    this.nav.setRoot(HomePage, {userId:user.id});
  }

  setMode(newMode) {
    this.menuMode = newMode;
  }

  createUser() {
    const modal = this.modalCtrl.create(NewUserPage, {isMandatory:false});
    modal.present();

    this.menuCtrl.close();
  }

  deleteUser(user) {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Please confirm you want to delete this user : ' + user['name'],
      buttons: [{
        text: 'Cancel',
        handler: () => {
          console.log('Disagree clicked');
        }
      },{
        text: 'Delete',
        handler: () => {
          this.dataProvider.removeUser(user['id']);
        }
      }]
    });
    confirm.present();
  }
}
