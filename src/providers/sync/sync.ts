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
            this.apiProvider.account(this.dataProvider.data['account']).subscribe(
	            res => {
	                if (res['status'] == 'error') {
						this.addError(res['code'], res['message']);
	                } else {
	                	this.dataProvider.data['account']['id'] = res['data']['id'];
	                	this.dataProvider.data['account']['isDirty'] = false;
	                	
	                	this.dataProvider.save();
	                    this.stop();
	                }
	                console.log(res);
	            },
	            error => {
	            	this.addError("0", "Error while contacting the API");
	            }
	        );
        }

        /* Sync users */
        if (!isDirty) {
        	let users = this.dataProvider.getData('users').filter(single_user => single_user['isDirty']);

        	if (users.length > 0) {
        		let single_user = users.shift();
        		isDirty = true;

        		console.log("Synching " + single_user['name']);
        		this.apiProvider.user(single_user, this.dataProvider.data['account']['id']).subscribe(
        			res => {
		                if (res['status'] == 'error') {
							this.addError(res['code'], res['message']);
		                } else {
		                	console.log(res);
		                	let oldId:string = single_user['id'];

		                	if (oldId != res['data']['id']) {
		                		single_user['id'] = res['data']['id'];

		                		// Update all sessions
		                		this.dataProvider.getData('sessions').forEach(single_session => {
		                			if (single_session['userId'] == oldId) {
		                				single_session['userId'] = single_user['id'];
		                			}
		                		});

		                		// Update all archives
		                		this.dataProvider.getData('archives').forEach(single_archive => {
		                			if (single_archive['userId'] == oldId) {
		                				single_archive['userId'] = single_user['id'];
		                				console.log(single_archive);

		                				single_archive['sessions'].forEach(single_session => {
				                			if (single_session['userId'] == oldId) {
				                				single_session['userId'] = single_user['id'];
				                			}
		                				});
		                			}
		                		});
		                	}
		                	single_user['isDirty'] = false;

		                	this.dataProvider.save();
		                    this.stop();
		                }
        			},
        			error => {
        				console.log(error);
        				this.addError("0", "Error while contacting the API");
        			}
        		);
        	}
        }

        /* Sync archives */
        if (!isDirty) {
        	let archives = this.dataProvider.getData('archives').filter(single_archive => single_archive['isDirty']);

        	if (archives.length > 0) {
        		let single_archive = archives.shift();
        		isDirty = true;

        		console.log("Synching archive ID:" + single_archive['id']);
        		this.apiProvider.archive(single_archive, this.dataProvider.data['account']['id']).subscribe(
        			res => {
		                if (res['status'] == 'error') {
							this.addError(res['code'], res['message']);
		                } else {
		                	console.log(res);
		                	
		                	let oldId:string = single_archive['id'];

		                	if (oldId != res['data']['id']) {
		                		single_archive['id'] = res['data']['id'];

		                		// Update all sessions
		                		this.dataProvider.getData('sessions').forEach(single_session => {
		                			if (single_session['userId'] == single_archive['userId'] && single_session['archiveId'] == oldId) {
		                				single_session['archiveId'] = single_archive['id'];
		                			}
		                		});
		                	}
		                	single_archive['isDirty'] = false;

		                	this.dataProvider.save();
		                    this.stop();
		                }
        			},
        			error => {
        				console.log(error);
        				this.addError("0", "Error while contacting the API");
        			}
        		);
        	}
        }

        /* Sync books */
        if (!isDirty) {
        	let books = this.dataProvider.getData('books').filter(single_archive => single_archive['isDirty']);

        	if (books.length > 0) {
        		let single_book = books.shift();
        		isDirty = true;

        		console.log("Synching book ID:" + single_book['id']);
        		this.apiProvider.book(single_book, this.dataProvider.data['account']['id']).subscribe(
        			res => {
		                if (res['status'] == 'error') {
							this.addError(res['code'], res['message']);
		                } else {
		                	console.log(res);
		                	
		                	let oldId:string = single_book['id'];

		                	if (oldId != res['data']['id']) {
		                		single_book['id'] = res['data']['id'];

		                		// Update all sessions
		                		this.dataProvider.getData('sessions').forEach(single_session => {
		                			if (single_session['bookId'] == oldId) {
		                				single_session['bookId'] = single_book['id'];
		                			}
		                		});
		                	}
		                	single_book['isDirty'] = false;

		                	this.dataProvider.save();
		                    this.stop();

		                }
        			},
        			error => {
        				console.log(error);
        				this.addError("0", "Error while contacting the API");
        			}
        		);
        	}
        }

        /* Sync sessions */
        if (!isDirty) {
        	let sessions = this.dataProvider.getData("sessions").filter(single_session => single_session['isDirty']);

        	if (sessions.length > 0) {
        		let single_session = sessions.shift();
        		isDirty = true;

        		console.log("Synching session ID:" + single_session['id']);
        		this.apiProvider.session(single_session, this.dataProvider.data['account']['id']).subscribe(
        			res => {
		                if (res['status'] == 'error') {
							this.addError(res['code'], res['message']);
		                } else {
		                	console.log(res);
		                	
		                	let oldId:string = single_session['id'];

		                	if (oldId != res['data']['id']) {
		                		single_session['id'] = res['data']['id'];
		                	}
		                	single_session['isDirty'] = false;

		                	this.dataProvider.save();
		                    this.stop();
		                }
        			},
        			error => {
        				console.log(error);
        				this.addError("0", "Error while contacting the API");
        			}
        		);
        	}
        }

        /* If something is dirty, start the synching */
        if (isDirty) {
        	this.isRunning = true;
        	return true;
        }

        console.log("Nothing to sync...");

		return false;
	}

	stop() {
		this.isRunning = false;
		this.start();
	}

	addError(code:string, message:string) {
		console.log(code, message);
		this.errors.push({
			code:code,
			message:message
		});

		this.isRunning = false;
	}
}
