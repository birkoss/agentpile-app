import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';
import { EditUserPage } from '../../pages/edit-user/edit-user';

import { DataProvider } from '../../providers/data/data'

@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html'
})
export class LoadingPage {
  loading:any;

  constructor(private dataProvider:DataProvider, private navCtrl:NavController) {}

  ionViewDidEnter() {
    this.dataProvider.load()
    .then((str) => {

        if (this.dataProvider.isLoggedIn()) {
          if (this.dataProvider.getUsers().length == 0) {
            this.navCtrl.setRoot(EditUserPage);
          } else {
            // @TODO: Must remember the last user and load it
            this.navCtrl.setRoot(HomePage, {userId: this.dataProvider.getUsers()[0]['id']});
          }
        } else {
          this.navCtrl.setRoot(LoginPage);
        }

    }, (error) => {
      alert("NOP: " + error);
    });
  }
}
