import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  constructor(private googlePlus:GooglePlus, private navCtrl:NavController) {

  }

  loginWithGoogle() {
    this.googlePlus.login({ "webClientId": "698237473663-7u72kk47fb77ck702hiasu7bddqohjm1.apps.googleusercontent.com" })
      .then(res => alert(":)" + JSON.stringify(res)))
      .catch(err => alert(":(" + err));
  }
}
