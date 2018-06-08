import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TimeValidator } from  '../../validators/time';

import { DataProvider } from '../../providers/data/data'

@Component({
	selector: 'page-new-user',
	templateUrl: 'new-user.html'
})
export class NewUserPage {

  myForm:any;

  submitAttempt:boolean = false;

  constructor(private dataProvider:DataProvider, private formBuilder:FormBuilder, private navCtrl:NavController) {
    this.myForm = formBuilder.group({
        name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-z ]*'), Validators.required])],
        hours: ['', TimeValidator.isValid],
        minutes: ['', TimeValidator.isValid],
        goal: ['', TimeValidator.isValid],
    });
  }

  /* https://www.joshmorony.com/advanced-forms-validation-in-ionic-2/ */
  /* https://stackoverflow.com/questions/35474991/angular-2-form-validating-for-repeat-password */

  isFieldInvalid(field_name:string):boolean {
    return !this.myForm.controls[field_name].valid && (this.myForm.controls[field_name].dirty || this.submitAttempt);
  }

  createUser() {
    this.submitAttempt = true;
    console.log(this.myForm);
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      alert("OUI");
    }
  }
}
