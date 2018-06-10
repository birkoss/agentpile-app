import { Component } from '@angular/core';
import { App, NavController, NavParams, ViewController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DataProvider } from '../../providers/data/data'

import { TimeValidator } from  '../../validators/time';

@Component({
	selector: 'page-new-session',
	templateUrl: 'new-session.html'
})
export class NewSessionPage {

  isMandatory:boolean = true;
  userId:number = 0;

  myForm:any;

  submitAttempt:boolean = false;

  goalMinutes:number = 0;
  goalHours:number = 0;

  minutes:number = 0;

  constructor(private app:App, private dataProvider:DataProvider, private formBuilder:FormBuilder, private navCtrl:NavController, private navParams:NavParams, private viewCtrl:ViewController) {
    if (navParams.get("userId") != null) {
      this.userId = navParams.get("userId");
    }
    if (navParams.get("minutes") != null) {
      this.minutes = navParams.get("minutes");
    }

    this.myForm = formBuilder.group({
        name: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("[0-9a-zA-z -!.']*"), Validators.required])],
        hours: ['0'],
        minutes: [this.minutes]
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  isFieldInvalid(field_name:string):boolean {
    return !this.myForm.controls[field_name].valid && (this.myForm.controls[field_name].dirty || this.submitAttempt);
  }

  createSession() {
    this.submitAttempt = (!this.myForm.valid);

    let total = (parseInt(this.myForm.controls.hours.value)*60) + parseInt(this.myForm.controls.minutes.value);
    if (total < this.minutes) {
      this.myForm.controls.hours.setErrors({a: {a:'aa'}});
      this.myForm.controls.minutes.setErrors({a: {a:'aa'}});
      
    }

    if (this.myForm.valid) {
      let minutes = (parseInt(this.myForm.controls.hours.value) * 60) + parseInt(this.myForm.controls.minutes.value);
      this.dataProvider.addSession(this.userId, this.myForm.value.name, minutes);

      this.viewCtrl.dismiss().then(() => {
      });
    }
  }
}
