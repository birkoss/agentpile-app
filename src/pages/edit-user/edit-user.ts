import { Component } from '@angular/core';
import { App, NavController, NavParams, ViewController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../../pages/home/home';

import { TimeValidator } from  '../../validators/time';

import { DataProvider } from '../../providers/data/data'

@Component({
	selector: 'page-edit-user',
	templateUrl: 'edit-user.html'
})
export class EditUserPage {

  isMandatory:boolean = true;
  userId:string = "";

  myForm:any;

  submitAttempt:boolean = false;

  goalMinutes:number = 0;
  goalHours:number = 0;

  constructor(private app:App, private dataProvider:DataProvider, private formBuilder:FormBuilder, private navCtrl:NavController, private navParams:NavParams, private viewCtrl:ViewController) {
    if (navParams.get("userId") != null) {
      this.userId = navParams.get("userId");
    }

    if (navParams.get("isMandatory") != null) {
      this.isMandatory = navParams.get("isMandatory");
    }

    this.myForm = formBuilder.group({
        name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-z ]*'), Validators.required])],
        minutes: ['20', TimeValidator.isValid],
        goal: ['36', TimeValidator.isValid],
    });

    this.calculateTotal(this.myForm.controls.minutes.value, this.myForm.controls.goal.value);
  }

  ionViewDidEnter() {
    const myFormValueChanges = this.myForm.valueChanges;

    myFormValueChanges.subscribe(control => {
      this.calculateTotal(control.minutes, control.goal);
    });
  }

  /* https://www.joshmorony.com/advanced-forms-validation-in-ionic-2/ */
  /* https://stackoverflow.com/questions/35474991/angular-2-form-validating-for-repeat-password */

  close() {
    this.viewCtrl.dismiss();
  }

  calculateTotal(minutes, goal) {
    let totalMinutes = goal * minutes;

    this.goalHours = Math.floor(totalMinutes / 60);
    this.goalMinutes = totalMinutes - (this.goalHours * 60);
  }

  isFieldInvalid(field_name:string):boolean {
    return !this.myForm.controls[field_name].valid && (this.myForm.controls[field_name].dirty || this.submitAttempt);
  }

  createUser() {
    this.submitAttempt = (!this.myForm.valid);

    if (this.myForm.valid) {
      let userId = this.dataProvider.addUser(this.myForm.value.name, this.myForm.value.minutes, this.myForm.value.goal);

      if (!this.isMandatory) {
        this.close();
      }

      this.app.getRootNav().setRoot(HomePage, {userId: userId});
    }
  }
}
