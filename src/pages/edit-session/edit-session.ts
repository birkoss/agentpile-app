import { Component, ViewChild } from '@angular/core';
import { AlertController, App, Content, NavController, NavParams, ViewController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DataProvider } from '../../providers/data/data'

import { TimeValidator } from  '../../validators/time';

@Component({
	selector: 'page-edit-session',
	templateUrl: 'edit-session.html'
})
export class EditSessionPage {
  @ViewChild(Content) content: Content;

  session:Object = {
    id:'',
    bookName:'',
    authorName:'',
    isCompleted:false,
    pageBookmark:0,
    bookId:0
  };

  book:string = "new";
  
  myForm:any;

  submitAttempt:boolean = false;

  callback:any = null;

  minMinutes:number = 0;

  constructor(private alertCtrl:AlertController, private app:App, private dataProvider:DataProvider, private formBuilder:FormBuilder, private navCtrl:NavController, private navParams:NavParams, private viewCtrl:ViewController) {

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

    if (this.session['bookId'] != 0) {
      this.book = "existing";
    }

    this.myForm = formBuilder.group({
        name: [this.session['bookName'], Validators.compose([Validators.maxLength(120), this.isBookNameInvalid.bind(this)])],
        author: [ this.session['authorName'], this.isBookAuthorInvalid.bind(this)],
        hours: [ hours ],
        minutes: [this.session['minutes']],
        isCompleted: [ this.session['isCompleted'] ],
        page: [ this.session['pageBookmark'] ],
        bookId: [ this.session['bookId'], this.isBookIdInvalid.bind(this) ]
    });
  }

  isBookIdInvalid(input:FormControl) {
    if (this.book == "new") {
      return null;
    }

    if (input.value == 0) {
      return {isMissing: true};
    }

    return null;
  }

  isBookAuthorInvalid(input:FormControl) {
    console.log(this, this.book);
    if (this.book == "existing") {
      return null;
    }

    if (input.value == "") {
      return {isEmpty: true};
    }

    return null;
  }

  isBookNameInvalid(input:FormControl) {
    if (this.book == "existing") {
      return null;
    }

    if (input.value == "") {
      return {isEmpty: true};
    }

    // @TODO: Must check if a book already exists with the same name and author
    return null;
  }

  onBookChanged() {
    for (var i in this.myForm.controls) {
      this.myForm.controls[i].updateValueAndValidity();
    }
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
        console.log(this.myForm);

    this.validateSession();

    if (this.myForm.valid) {
      let minutes = (parseInt(this.myForm.controls.hours.value) * 60) + parseInt(this.myForm.controls.minutes.value);

      let bookId = 0;
      if (this.book == "new") {
        let bookId = this.dataProvider.addBook(this.myForm.value.name, this.myForm.value.author);
      } else {
        bookId = this.myForm.value.bookId;
      }

     this.dataProvider.addSession(this.session['userId'], bookId, minutes, this.myForm.value.isCompleted, this.myForm.value.page);

     this.close();
    } else {
      this.content.scrollToTop();
    }
  }

  updateSession() {
    console.log(this.myForm);
    this.validateSession();

    if (this.myForm.valid) {
      let minutes = (parseInt(this.myForm.controls.hours.value) * 60) + parseInt(this.myForm.controls.minutes.value);
      
      let bookId = 0;
      if (this.book == "new") {
        bookId = this.dataProvider.addBook(this.myForm.value.name, this.myForm.value.author);
      } else {
        bookId = this.myForm.value.bookId;
      }

      this.dataProvider.editSession(this.session['userId'], bookId, minutes, this.myForm.value.isCompleted, this.myForm.value.page, this.session['id']);

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

  deleteSession() {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Please confirm you want to delete this session : ' + this.session['bookName'],
      buttons: [{
        text: 'Cancel',
        handler: () => {
          console.log('Disagree clicked');
        }
      },{
        text: 'Delete',
        handler: () => {
          this.dataProvider.removeSession(this.session['userId'], this.session['id']);

          this.close();
        }
      }]
    });
    confirm.present();
  }

}
