import { Component, ViewChild } from '@angular/core';
import { MenuController, ModalController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoadingPage } from '../pages/loading/loading';
import { HomePage } from '../pages/home/home';
import { EditUserPage } from '../pages/edit-user/edit-user';

import { DataProvider } from '../providers/data/data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoadingPage;

  menuMode:string = "normal";

  constructor(private dataProvider:DataProvider, private menuCtrl:MenuController, private modalCtrl:ModalController, public platform:Platform, public statusBar:StatusBar, public splashScreen:SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();

      //this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#371B53');

      this.splashScreen.hide();
    });
  }

  loadUser(user) {
    this.nav.setRoot(HomePage, {userId:user.id});
  }

  setMode(newMode) {
    this.menuMode = newMode;
  }

  menuClosed() {
    this.setMode('normal');
  }

  createUser() {
    const modal = this.modalCtrl.create(EditUserPage, {isMandatory:false});
    modal.present();

    this.menuCtrl.close();
  }

  editUser(user) {
    const modal = this.modalCtrl.create(EditUserPage, {isMandatory:false, userId:user['id']});
    modal.present();

    this.menuCtrl.close();
  }
}
