import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class DataProvider {
	login:any;

	constructor(private storage:Storage) {
		this.login = null;
		if (this.isDebug()) {
			this.login = {
				token: "debug",
				platform: "browser"
			};
		}
	}

 	public loadLogin() {
        return new Promise((resolve, reject) => {
            this.storage.get('login').then(data => {
                if (data != null) {
                    data = JSON.parse(data);
                    this.login = data;

                    console.log("loading: ", data, this.login);
                }
                resolve("ok");
            });
        });
    }

	saveLogin(token:string, platform:string) {
		this.login = {
			token: token,
			platform: platform
		};

		this.storage.set('login', JSON.stringify(this.login));

		alert( JSON.stringify(this.login) );
	}

	isLoggedIn():boolean {
		return this.login !== null;
	}

	isDebug():boolean {
		return !((<any>window).cordova);
	}
}
