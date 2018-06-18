import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data'

@Component({
	selector: 'page-timer',
	templateUrl: 'timer.html'
})
export class TimerPage {

  constructor(private dataProvider:DataProvider, private navCtrl:NavController, private navParams:NavParams, private viewCtrl:ViewController) { }

  close() {
    this.viewCtrl.dismiss();
  }

ngOnInit() {
    this.initTimer();
    this.startTimer();
  }
  
  initTimer() {
/*
     // Pomodoro is usually for 25 minutes
    if (!this.timeInSeconds) { 
      this.timeInSeconds = 1500; 
    }
  
    this.time = this.timeInSeconds;
    this.runTimer = false;
    this.hasStarted = false;
    this.hasFinished = false;
    this.remainingTime = this.timeInSeconds;
    
    this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
    */
  }
  
  startTimer() {
    //  this.runTimer = true;
    // this.hasStarted = true;
    // this.timerTick();
  }
  
  pauseTimer() {
    // this.runTimer = false;
  }
  
  resumeTimer() {
    this.startTimer();
  }
  
  timerTick() {
    // setTimeout(() => {
  
    //   if (!this.runTimer) { return; }
    //   this.remainingTime--;
    //   this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
    //   if (this.remainingTime > 0) {
    //     this.timerTick();
    //   }
    //   else {
    //     this.hasFinished = true;
    //   }
    // }, 1000);
  }
  
  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }
}
