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
                } else {
					if (this.isDebug()) {
						this.login('debug', 'browser');
					}
                }
                resolve("ok");
            });
        });
    }

    public save() {
		this.storage.set('data', JSON.stringify(this.data));
    }

    addUser(name, minutes, sessions) {
    	let newId:number = 0;
    	this.data['users'].forEach(single_user => {
    		newId = Math.max(single_user['id'], newId);
    	});
    	newId++;

    	this.data['users'].push({
    		id:newId,
    		name:name,
    		minutes:minutes,
    		sessions:sessions
    	});

        this.data['sessions'][newId] = [[]];

    	this.save();

    	return newId;
    }

    removeUser(userId:number) {
    	this.data['users'] = this.data['users'].filter(single_user => single_user['id'] != userId);
    	
    	this.save();
    }

    addSession(userId:number, bookName:string, minutes:Number) {
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

        this.getAllSessions(userId).push({
            bookName:bookName,
            minutes:minutes,
            when:year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day,
            isSaved:false,
            status:'active'
        });

        this.save();
    }

    removeSession(userId:number, session:object) {
       this.getSession(userId).forEach(single_session => {
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

    getSession(userId):Array<Object> {
        return this.getAllSessions(userId).filter(single_session => single_session['status'] == 'active');
    }

	getUsers():Array<Object> {
		return this.data['users'];
	}

	isLoggedIn():boolean {
        let loggedIn = this.data['account']['id'] !== '';

        if (!loggedIn && this.isDebug()) {
            this.login('TMP_account', 'debug', 'browser');
            return this.isLoggedIn();
        }

        return loggedIn;
	}

	isDebug():boolean {
		return !((<any>window).cordova);
	}
}
