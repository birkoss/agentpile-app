import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class DataProvider {
	data:Object;

	constructor(private storage:Storage) {
		this.data = {
			'login': {
				token: '',
				platform: ''
			},
			'users': []
		};
	}

 	public load() {
        return new Promise((resolve, reject) => {
            this.storage.get('data').then(data => {
            	console.log(data);
                if (data != null) {
                    data = JSON.parse(data);
                    this.data = data;

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

	login(token:string, platform:string) {
		this.data['login'] = {
			token: token,
			platform: platform
		};

		this.storage.set('data', JSON.stringify(this.data));
	}

	getUsers():Array<Object> {
		return this.data['users'];
	}

	isLoggedIn():boolean {
		return this.data['login'] !== '';
	}

	isDebug():boolean {
		return !((<any>window).cordova);
	}
}
