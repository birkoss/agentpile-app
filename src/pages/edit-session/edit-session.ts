import { Component } from '@angular/core';
import { App, NavController, NavParams, ViewController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DataProvider } from '../../providers/data/data'

import { TimeValidator } from  '../../validators/time';

@Component({
	selector: 'page-edit-session',
	templateUrl: 'edit-session.html'
})
export class EditSessionPage {

  session:Object = {
    id:'',
    bookName:'',
    authorName:'',
    isCompleted:false,
    pageBookmark:0
  };
  
  myForm:any;

  submitAttempt:boolean = false;

  callback:any = null;

  minMinutes:number = 0;

  constructor(private app:App, private dataProvider:DataProvider, private formBuilder:FormBuilder, private navCtrl:NavController, private navParams:NavParams, private viewCtrl:ViewController) {

    let hours:number = 0;

    if (navParams.get("minutes") != null) {
      this.minMinutes = navParams.get("minutes");
      this.session['minutes'] = navParams.get("minutes");
    }

    if (navParams.get("session") != null) {
      this.session = JSON.parse(JSON.stringify(navParams.get("session")));
      this.session['userId'] = navParams.get("userId");

      // Update the minutes and hours
      hours = Math.floor(this.session['minutes'] / 60);
      this.session['minutes'] = this.session['minutes'] - (hours * 60);

    } else if (navParams.get("userId") != null) {
      this.session['userId'] = navParams.get("userId");
    }

    if (navParams.get("callback") != null) {
      this.callback = navParams.get("callback");
    }

    this.myForm = formBuilder.group({
        name: [this.session['bookName'], Validators.compose([Validators.maxLength(100), Validators.pattern("[0-9a-zA-z -!.']*"), Validators.required])],
        hours: [ hours ],
        minutes: [this.session['minutes']],
        author: [ this.session['authorName'] ],
        isCompleted: [ this.session['isCompleted'] ],
        page: [ this.session['pageBookmark'] ]
    });
  }

  close() {
    this.viewCtrl.dismiss().then(() => {
      if (this.callback != null) {
        this.callback();
      }
    });
  }

  isFieldInvalid(field_name:string):boolean {
    return !this.myForm.controls[field_name].valid && (this.myForm.controls[field_name].dirty || this.submitAttempt);
  }

  createSession() {
    this.validateSession();

    if (this.myForm.valid) {
      let minutes = (parseInt(this.myForm.controls.hours.value) * 60) + parseInt(this.myForm.controls.minutes.value);
      this.dataProvider.addSession(this.session['userId'], this.myForm.value.name, minutes, this.myForm.value.author, this.myForm.value.isCompleted, this.myForm.value.page);

      this.close();
    }
  }

  updateSession() {
    this.validateSession();

    if (this.myForm.valid) {
      let minutes = (parseInt(this.myForm.controls.hours.value) * 60) + parseInt(this.myForm.controls.minutes.value);
      
      this.dataProvider.editSession(this.session['userId'], this.myForm.value.name, minutes, this.myForm.value.author, this.myForm.value.isCompleted, this.myForm.value.page, this.session['id']);

      this.close();
    }
  }

  validateSession() {
    this.submitAttempt = (!this.myForm.valid);

    let total = (parseInt(this.myForm.controls.hours.value)*60) + parseInt(this.myForm.controls.minutes.value);
    if (total < this.minMinutes) {
      this.myForm.controls.hours.setErrors({a: {a:'aa'}});
      this.myForm.controls.minutes.setErrors({a: {a:'aa'}});
    }
  }

  isNew():boolean {
    return this.session['id'] == '';
  }

  deleteSession(session) {
    /*
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Please confirm you want to delete this session : ' + session['bookName'],
      buttons: [{
        text: 'Cancel',
        handler: () => {
          console.log('Disagree clicked');
        }
      },{
        text: 'Delete',
        handler: () => {
          this.dataProvider.removeSession(this.userId, session);
        }
      }]
    });
    confirm.present();
    */
  }

}
