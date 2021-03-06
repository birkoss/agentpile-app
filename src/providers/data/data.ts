import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { ApiProvider } from '../api/api';

@Injectable()
export class DataProvider {
	data:Object;

    isSynching:boolean = false;

	constructor(private apiProvider:ApiProvider, private storage:Storage) {
		this.data = {
			'account': {
                id: '',
				token: '',
				platform: '',
                isDirty: true
			},
			'users': [],
            'sessions': [],
            'archives': [],
            'books': [],
            'settings': {
                'active_user': ''
            },

            'timers': []
		};
	}

 	public load() {
        return new Promise((resolve, reject) => {
            this.storage.get('data').then(data => {
                if (data != null) {
                    data = JSON.parse(data);
                    for (var key in data) {
                        this.data[key] = data[key];
                    }
                    console.log("loading: ", data, this.data);
                }
                resolve("ok");
            });
        });
    }

    public save() {
		this.storage.set('data', JSON.stringify(this.data));
    }

    public getData(id:string):Array<Object> {
        return this.data[id];
    }

    /* Users */

    addUser(name, minutes, sessions) {
    	let newId:string = "tmp_" + this.generateId();

    	this.data['users'].push({
    		id:newId,
    		name:name,
    		minutes:minutes,
    		sessions:sessions,
            status:'active',
            isDirty:true
    	});

    	this.save();

    	return newId;
    }

    editUser(name, minutes, sessions, userId) {
        this.data['users'].forEach(single_user => {
            if (single_user['id'] == userId) {
                single_user['name'] = name;
                single_user['minutes'] = minutes;
                single_user['sessions'] = sessions;
                single_user['isDirty'] = true;
            }
        });

        this.save();

        return userId;
    }

    getUser(userId:string) {
        return this.getUsers().find(single_user => single_user['id'] == userId);
    }

    getUsers():Array<Object> {
        return this.data['users'].filter(single_user => single_user['status'] == 'active');
    }

    removeUser(userId:string) {
        this.data['users'].forEach(single_user => {
            if (single_user['id'] == userId) {
                single_user['status'] = 'deleted';
                single_user['isDirty'] = true;
            }
        });
    	
    	this.save();
    }

    /* Sessions */

    addSession(userId:number, bookId:string, minutes:Number, isCompleted:boolean, pageBookmark:number) {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

        this.data['sessions'].push({
            id:'tmp_' + this.generateId(),
            timestamp:Date.now(),
            bookId:bookId,
            isCompleted:isCompleted,
            pageBookmark:pageBookmark,
            userId:userId,
            minutes:minutes,
            when:year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day,
            isDirty:true,
            status:'active'
        });

        this.save();
    }

    editSession(userId:number, bookId:string, minutes:Number, isCompleted:boolean, pageBookmark:number, sessionId:string) {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

        this.getSessions(userId).forEach(single_session => {
            if (single_session['id'] == sessionId) {
                single_session['bookId'] = bookId;
                single_session['minutes'] = minutes;
                single_session['isCompleted'] = isCompleted;
                single_session['pageBookmark'] = pageBookmark;
                single_session['isDirty'] = true;
            }
        });

        this.save();
    }

    getSession(userId:string, sessionId:string) {
        return this.getUserSessions(userId).find(single_session => single_session['id'] == sessionId);
    }

    getUserSessions(userId:string, archiveId:string = null) {
        return this.data['sessions'].filter(single_session => single_session['userId'] == userId && single_session['archiveId'] == archiveId);
    }

    getSessions(userId):Array<Object> {
        return this.getUserSessions(userId).filter(single_session => single_session['status'] == 'active').sort((a, b) => {
            if (a['timestamp'] < b['timestamp']) {
                return 1
            } else if (a['timestamp'] > b['timestamp']) {
                return -1;
            }
            return 0;
        });
    }

    removeSession(userId:any, sessionId:string) {
       this.getSessions(userId).forEach(single_session => {
           if (single_session['id'] == sessionId) {
               single_session['status'] = 'deleted';
               single_session['isDirty'] = true;

           }
       });

       this.save();
    }

    /* Archives */

    createArchive(userId:string) {
        let archive:Object = {
            id:"tmp_" + this.generateId(),
            userId:userId,
            isDirty:true
        }

        this.data['archives'].push(archive);

        this.getUserSessions(userId).forEach(single_session => {
            single_session['archiveId'] = archive['id'];
        });

        this.save();

        return true;
    }

    getArchives(userId:string) {
        return this.data['archives'].filter(single_archive => single_archive['userId'] == userId);
    }

    /* Books */

    addBook(name:string, author:string):string {
        let book = {
            id:'tmp_' + this.generateId(),
            name:name,
            author:author,
            isDirty:true
        };

        this.data['books'].push(book);
        this.save();

        return book['id'];
    }

    getBooks():Array<Object> {
        return this.data['books'];
    }

    /* Account */

    login(id:string, token:string, platform:string) {
        this.data['account'] = {
            id: id,
            token: token,
            platform: platform,
            isDirty: true
        };

        this.save();
    }

	isLoggedIn():boolean {
        let loggedIn = this.data['account']['id'] !== '';

        if (!loggedIn && this.isDebug()) {
            this.login('TMP_account', 'debug', 'browser');
            return this.isLoggedIn();
        }

        return loggedIn;
	}

    /* Settings */

    setActiveUser(userId:string):boolean {
        if (userId != this.getActiveUser()) {
            this.data['settings']['active_user'] = userId;

            this.save();
            return true;
        }
        return false;
    }

    getActiveUser():string {
        return this.data['settings']['active_user'];
    }

    startTimer(userId:string, minutes:number, end:number) {
        this.data['timers'] = [{
            userId:userId,
            minutes:minutes,
            end:end
        }];

        this.save();
    }

    hasTimer():Boolean {
        return false;
    }

    /* Helpers */

	isDebug():boolean {
		return !((<any>window).cordova);
	}

    generateId():string {
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 16; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }
}
