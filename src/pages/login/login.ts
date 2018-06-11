import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';

import { LoadingPage } from '../../pages/loading/loading';

import { DataProvider } from '../../providers/data/data'

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {
  constructor(private dataProvider:DataProvider, private googlePlus:GooglePlus, private navCtrl:NavController) {}

  loginWithGoogle() {
    this.googlePlus.login({"webClientId": "698237473663-7u72kk47fb77ck702hiasu7bddqohjm1.apps.googleusercontent.com"})
      .then(res => {
        this.dataProvider.login("tmp_" + this.dataProvider.generateId(), res['idToken'], 'google');
          this.navCtrl.setRoot(LoadingPage);
      })
      .catch(err => alert(":(" + err));
  }
}
