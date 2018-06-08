import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoadingPage } from '../pages/loading/loading';
import { HomePage } from '../pages/home/home';

import { DataProvider } from '../providers/data/data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoadingPage;

  children: Array<{name: string, id: string}>;

  constructor(private dataProvider:DataProvider, public platform:Platform, public statusBar:StatusBar, public splashScreen:SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  loadUser(user) {
    this.nav.setRoot(HomePage, {user:user});
  }
}
