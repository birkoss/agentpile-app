import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data'

@Component({
	selector: 'page-session-completed',
	templateUrl: 'session-completed.html'
})
export class SessionCompletedPage {

  constructor(private dataProvider:DataProvider, private navCtrl:NavController, private navParams:NavParams, private viewCtrl:ViewController) { }

  close() {
    this.viewCtrl.dismiss();
  }
}
