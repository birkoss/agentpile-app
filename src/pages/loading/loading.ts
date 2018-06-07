import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';

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
    this.dataProvider.loadLogin()
    .then(function(str) {
        me.loading.dismiss();

        me.navCtrl.setRoot(me.dataProvider.isLoggedIn() ? HomePage : LoginPage);
    })
    .catch((err) => { alert("NOP: " + err)});
  }
}
