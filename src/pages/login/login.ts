import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { GooglePlus } from '@ionic-native/google-plus';

import { DataProvider } from '../../providers/data/data'

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {
  constructor(private dataProvider:DataProvider, private googlePlus:GooglePlus, private navCtrl:NavController) {}

  loginWithGoogle() {
    this.googlePlus.login({ "webClientId": "698237473663-7u72kk47fb77ck702hiasu7bddqohjm1.apps.googleusercontent.com" })
      .then(res => {
        this.dataProvider.login(res['idToken'], 'google');
      })
      .catch(err => alert(":(" + err));
  }
}
