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

		let isDirty:boolean = false;

        /* Sync account */
        if (this.dataProvider.data['account']['isDirty']) {
        	isDirty = true;
            this.apiProvider.getAccount(this.dataProvider.data['account']).subscribe(
	            res => {
	                if (res['status'] == 'error') {
						this.addError(res['code'], res['message']);
	                } else {
	                	this.dataProvider.data['account']['id'] = res['data']['id'];
	                	this.dataProvider.data['account']['isDirty'] = false;
	                	this.dataProvider.save();

	                    this.isRunning = false;
	                }
	                console.log(res);
	            },
	            error => {
	            	this.addError("0", "Error while contacting the API");
	            }
	        );
        }

        if (isDirty) {
        	this.isRunning = true;
        	return true;
        }
        
        // Sync account

        // Sync users
        // - Update sessions userId
        // - Update archive userId
        // - Update archive sessions userId

        // Sync sessions

        // Sync archives

		return false;
	}

	addError(code:string, message:string) {
		this.errors.push({
			code:code,
			message:message
		});

		this.isRunning = false;
	}
}
