import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoadingPage } from '../pages/loading/loading';
import { LoginPage } from '../pages/login/login';
import { NewSessionPage } from '../pages/new-session/new-session';
import { NewUserPage } from '../pages/new-user/new-user';
import { SessionCompletedPage } from '../pages/session-completed/session-completed';

import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GooglePlus } from '@ionic-native/google-plus';

import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { DataProvider } from '../providers/data/data';
import { ApiProvider } from '../providers/api/api';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoadingPage,
    LoginPage,
    NewSessionPage,
    NewUserPage,
    SessionCompletedPage
  ],
  imports: [
    BrowserModule,
    RoundProgressModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoadingPage,
    LoginPage,
    NewSessionPage,
    NewUserPage,
    SessionCompletedPage
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    ApiProvider
  ]
})
export class AppModule {}
