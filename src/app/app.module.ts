import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoadingPage } from '../pages/loading/loading';
import { LoginPage } from '../pages/login/login';
import { EditSessionPage } from '../pages/edit-session/edit-session';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { SessionCompletedPage } from '../pages/session-completed/session-completed';
import { TimerPage } from '../pages/timer/timer';

import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { GooglePlus } from '@ionic-native/google-plus';

import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { DataProvider } from '../providers/data/data';
import { ApiProvider } from '../providers/api/api';
import { SyncProvider } from '../providers/sync/sync';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoadingPage,
    LoginPage,
    EditSessionPage,
    EditUserPage,
    SessionCompletedPage,
    TimerPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
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
    EditSessionPage,
    EditUserPage,
    SessionCompletedPage,
    TimerPage
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    ApiProvider,
    SyncProvider,
    LocalNotifications
  ]
})
export class AppModule {}
