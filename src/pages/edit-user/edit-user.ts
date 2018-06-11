import { Component } from '@angular/core';
import { AlertController, App, NavController, NavParams, ViewController } from 'ionic-angular';

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

  // @TODO: Keep only the user, not the userId since it's already in the User
  userId:string = "";
  user:any;

  myForm:any;

  submitAttempt:boolean = false;

  goalMinutes:number = 0;
  goalHours:number = 0;

  constructor(private alertCtrl:AlertController, private app:App, private dataProvider:DataProvider, private formBuilder:FormBuilder, private navCtrl:NavController, private navParams:NavParams, private viewCtrl:ViewController) {

    let defaultName:string = "";
    let defaultMinutes:number = 20;
    let defaultSessions:number = 36;

    if (navParams.get("userId") != null) {
      this.userId = navParams.get("userId");
      this.user = this.dataProvider.getUser(this.userId);
      
      defaultName = this.user['name'];
      defaultMinutes = this.user['minutes'];
      defaultSessions = this.user['sessions'];
    }

    if (navParams.get("isMandatory") != null) {
      this.isMandatory = navParams.get("isMandatory");
    }

    this.myForm = formBuilder.group({
        name: [defaultName, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-z ]*'), Validators.required])],
        minutes: [defaultMinutes, TimeValidator.isValid],
        sessions: [defaultSessions, TimeValidator.isValid],
    });

    this.calculateTotal(this.myForm.controls.minutes.value, this.myForm.controls.sessions.value);
  }

  ionViewDidEnter() {
    const myFormValueChanges = this.myForm.valueChanges;

    myFormValueChanges.subscribe(control => {
      this.calculateTotal(control.minutes, control.sessions);
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
      let userId = this.dataProvider.addUser(this.myForm.value.name, this.myForm.value.minutes, this.myForm.value.sessions);

      if (!this.isMandatory) {
        this.close();
      }

      this.app.getRootNav().setRoot(HomePage, {userId: userId});
    }
  }

  updateUser() {
    this.submitAttempt = (!this.myForm.valid);

    if (this.myForm.valid) {

      this.user['name'] = "aaaa";

      console.log(this.dataProvider.getUsers());

      this.dataProvider.editUser(this.myForm.value.name, this.myForm.value.minutes, this.myForm.value.sessions, this.userId);

      if (!this.isMandatory) {
        this.close();
      }

      this.app.getRootNav().setRoot(HomePage, {userId: this.userId});
    }
  }

  deleteUser() {
    const confirm = this.alertCtrl.create({
      title: 'Confirmation?',
      message: 'Veuillez confirmer la supression de l\'utilisateur : ' + this.user['name'],
      buttons: [{
        text: 'Annuler',
        handler: () => {
        }
      },{
        text: 'Supprimer',
        handler: () => {
          this.dataProvider.removeUser(this.userId);
          this.close();

          if (this.dataProvider.getUsers().length == 0) {
            this.navCtrl.setRoot(EditUserPage);
          } else {
            this.app.getRootNav().setRoot(HomePage, {userId: this.dataProvider.getUsers()[0]['id']});
          }
        }
      }]
    });
    confirm.present();
  }

}
