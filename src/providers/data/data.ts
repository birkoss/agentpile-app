import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class DataProvider {
	data:Object;

	constructor(private storage:Storage) {
		this.data = {
			'account': {
                id: '',
				token: '',
				platform: '',
                isDirty: true
			},
			'users': [],
            'sessions': {},
            'settings': {
                'active_user': ''
            }
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

        this.data['sessions'][newId] = [[]];

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
        return this.data['users'].find(single_user => single_user['id'] == userId);
    }

    removeUser(userId:string) {
        this.data['users'].forEach(single_user => {
            if (single_user['id'] == userId) {
                single_user['status'] = 'deleted';
            }
        });
    	
    	this.save();
    }

    addSession(userId:number, bookName:string, minutes:Number, authorName:string, isCompleted:boolean, pageBookmark:number) {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

        this.getAllSessions(userId).push({
            id:'tmp_' + this.generateId(),
            bookName:bookName,
            authorName:authorName,
            isCompleted:isCompleted,
            pageBookmark:pageBookmark,
            minutes:minutes,
            when:year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day,
            isDirty:true,
            status:'active'
        });

        this.save();
    }

    editSession(userId:number, bookName:string, minutes:Number, authorName:string, isCompleted:boolean, pageBookmark:number, sessionId:string) {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

        this.getSessions(userId).forEach(single_session => {
            if (single_session['id'] == sessionId) {
                single_session['bookName'] = bookName;
                single_session['minutes'] = minutes;
                single_session['authorName'] = authorName;
                single_session['isCompleted'] = isCompleted;
                single_session['pageBookmark'] = pageBookmark;
                single_session['isDirty'] = true;
            }
        });

        this.save();
    }

    getSession(userId:string, sessionId:string) {
        return this.getSessions(userId).find(single_session => single_session['id'] == sessionId);
    }

    removeSession(userId:any, session:object) {
       this.getSessions(userId).forEach(single_session => {
           if (single_session['bookName'] == session['bookName'] && single_session['when'] == session['when']) {
               single_session['status'] = 'deleted';
           }
       });

       this.save();
    }

	login(id:string, token:string, platform:string) {
		this.data['account'] = {
            id: id,
			token: token,
			platform: platform,
            isDirty: true
		};

		this.save();
	}

    getAllSessions(userId):Array<Object> {
        return this.data['sessions'][userId].slice(-1)[0].reverse();
    }

    getSessions(userId):Array<Object> {
        return this.getAllSessions(userId).filter(single_session => single_session['status'] == 'active');
    }

    getAllUsers():Array<Object> {
        return this.data['users'];
    }

	getUsers():Array<Object> {
		return this.getAllUsers().filter(single_user => single_user['status'] == 'active');
	}

	isLoggedIn():boolean {
        let loggedIn = this.data['account']['id'] !== '';

        if (!loggedIn && this.isDebug()) {
            this.login('TMP_account', 'debug', 'browser');
            return this.isLoggedIn();
        }

        return loggedIn;
	}

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
