import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  current: number = 12;
  max: number = 36;
  radius: number = 125;
  color: string = '#45ccce';

  child:any;


  constructor(private navCtrl:NavController, private navParams:NavParams) {
    this.child = this.navParams.get("child");
  }

  increase() {
  	this.current++;
  }

getOverlayStyle() {
    let transform = 'translateY(-50%) translateX(-50%)';

    return {
      'top':  '50%',
      'bottom':  'auto',
      'left': '50%',
      'transform': transform,
      '-moz-transform': transform,
      '-webkit-transform': transform,
      'font-size': this.radius / 3.5 + 'px'
    };
  }

}
