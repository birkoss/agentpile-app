import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';
import { NewUserPage } from '../../pages/new-user/new-user';

import { DataProvider } from '../../providers/data/data'

@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html'
})
export class LoadingPage {
  loading:any;

  constructor(private dataProvider:DataProvider, private loadingCtrl:LoadingController, private navCtrl:NavController) {}

  ionViewDidEnter() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...'
    });
    this.loading.present();

    let me = this;
    this.dataProvider.load()
    .then(function(str) {
        me.loading.dismiss();

        if (me.dataProvider.isLoggedIn()) {
          if (me.dataProvider.getUsers().length == 0) {
            me.navCtrl.setRoot(NewUserPage);
          } else {
            // @TODO: Must remember the last user and load it
            me.navCtrl.setRoot(HomePage, {userId: me.dataProvider.getUsers()[0]['id']});
          }
        } else {
          me.navCtrl.setRoot(LoginPage);
        }
    })
    .catch((err) => { alert("NOP: " + err)});
  }
}
