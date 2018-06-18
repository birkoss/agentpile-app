import { Component } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, NavParams } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { EditSessionPage } from '../../pages/edit-session/edit-session';
import { SessionCompletedPage } from '../../pages/session-completed/session-completed';
import { LoadingPage } from '../../pages/loading/loading';

import { DataProvider } from '../../providers/data/data'
import { SyncProvider } from '../../providers/sync/sync'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  max: number = 100;
  radius: number = 125;
  color: string = '#FAB73A';

  user:any;

  listMode:string = "normal";

  constructor(private alertCtrl:AlertController, private dataProvider:DataProvider, private localNotifications:LocalNotifications, private menuCtrl:MenuController, private modalCtrl:ModalController, private navCtrl:NavController, private navParams:NavParams, private syncProvider:SyncProvider) {
    
    this.user = this.dataProvider.getUsers().find(single_user => single_user['id'] == this.navParams.get("userId"));

    this.max = this.user['sessions'];

    // @TODO: Add the timer feature, Add a notification at the end

    this.dataProvider.setActiveUser(this.user['id']);
  }

  ionViewDidEnter() {
    this.refresh();
  }

  showMenu() {
    this.menuCtrl.open();
  }

  startTimer() {
    const prompt = this.alertCtrl.create({
      title: 'Minuterie',
      message: "Veuillez entrer le nombre de minutes pour commencer la minuterie",
      inputs: [
        {
          name: 'minutes',
          placeholder: this.user['minutes'],
          value: this.user['minutes']
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Commencer',
          handler: data => {
            /* @TODO: Handling input */

            let end = new Date(new Date().getTime() + (60000 * parseInt(data['minutes'])));

            this.dataProvider.startTimer(this.user['id'], data['minutes'], end.getTime());

            this.localNotifications.schedule({
              text: "Votre minuterie de " + parseInt(data['minutes']) + " minutes est terminée!",
              trigger: {at:  end},
              led: '532981',
              smallIcon: 'res://notification.png'
            });

            this.navCtrl.setRoot(LoadingPage);
          }
        }
      ]
    });
    prompt.present();
  }

  refresh() {
    /* Check the status of timers */
    try {
      this.localNotifications.getScheduledIds().then(res => {
       // alert(JSON.stringify(res));
      }).catch(err => { alert("Error:" + err); });

      /* Check completions */
      let isCompleted:boolean = (this.getProgression() >= this.max);

      if (isCompleted) {
        this.dataProvider.createArchive(this.user['id']);      
        
        const modal = this.modalCtrl.create(SessionCompletedPage);
        modal.present(); 
      }

      /* Create a X days notifications reminder */
      this.localNotifications.clear(1);
      this.localNotifications.schedule({
        id: 1,
        text: "Vous n'avez pas lu dans la dernière journée!",
        trigger: {at:  new Date(new Date().getTime() + 86400000)},
        led: '532981',
        smallIcon: 'res://notification.png'
      });
    } catch(err) {

    }
  }

  setMode(newMode) {
    this.listMode = newMode;
  }

  sync() {
    this.syncProvider.start();
  }

  addSession() {
    const modal = this.modalCtrl.create(EditSessionPage, {userId:this.user['id'], minutes:this.user['minutes'], callback:this.refresh.bind(this)});
    modal.present();
  }

  editSession(session:object) {
    const modal = this.modalCtrl.create(EditSessionPage, {userId:this.user['id'], minutes:this.user['minutes'], session:session});
    modal.present();
  }

  getProgression():number {
    return this.getSessions().length;
  }

  getSessions():Array<Object> {
    return this.dataProvider.getSessions(this.user['id']);
  }

  getArchives():Array<Object> {
    return this.dataProvider.getArchives(this.user['id']);
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
