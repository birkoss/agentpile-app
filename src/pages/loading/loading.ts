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
            let userId = this.dataProvider.getActiveUser();
            
            /* Verify that the Active User is still present */
            if (this.dataProvider.getUsers().find(single_user => single_user['id'] == userId) == null) {
              /* Pick the first user */
              userId = this.dataProvider.getUsers()[0]['id'];
            }

            this.navCtrl.setRoot(HomePage, {userId:userId});
          }
        } else {
          this.navCtrl.setRoot(LoginPage);
        }

    }, (error) => {
      alert("NOP: " + error);
    });
  }
}
