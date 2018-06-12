import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';
import { DataProvider } from '../data/data';

@Injectable()
export class SyncProvider {

	isRunning:boolean = false;
	errors:Array<Object> = [];

	constructor(private apiProvider:ApiProvider, private dataProvider:DataProvider) { }

	hasError():boolean {
		return this.errors.length > 0;
	}

	start():boolean {
		if (this.isRunning) {
			return false;
		}

		this.isRunning = true;

        console.log("sync...");
        if (this.dataProvider.data['account']['isDirty']) {
            this.apiProvider.getAccount(this.dataProvider.data['account']).subscribe(
	            value => {
	                if (value['status'] == 'error') {
						this.addError(value['code'], value['message']);
	                } else {
	                    
	                }
	                console.log(value);
	            },
	            error => {
	            	console.log(error);
	            	this.addError("0", "Error while contacting the API");
	            }
	        );

            console.log('must sync...');
        }
        
        // Sync account

        // Sync users
        // - Update sessions userId
        // - Update archive userId
        // - Update archive sessions userId

        // Sync sessions

        // Sync archives

		return true;
	}

	addError(code:string, message:string) {
		this.errors.push({
			code:code,
			message:message
		});

		this.isRunning = false;
	}
}
