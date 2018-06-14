import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http'


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiProvider {

	public static API_ENDPOINT='https://agentpile.com/api/';

	constructor(private httpClient:HttpClient, private http:Http) { }

	account(data) {
		console.log(data);
		let params = {
			params: {
				token:data['token'],
				platform:data['platform']
			}
		};

		return this.httpClient.get(ApiProvider.API_ENDPOINT+'accounts/get.php', params);
	}

	user(data, account_id) {
		let params = {
			params: {
				id:data['id'],
				account_id:account_id,
				status:data['status']
			}
		};

		return this.httpClient.get(ApiProvider.API_ENDPOINT+'users/get.php', params);
	}

	archive(data, account_id) {
		let params = {
			params: {
				id:data['id'],
				user_id:data['userId'],
				account_id:account_id
			}
		};

		return this.httpClient.get(ApiProvider.API_ENDPOINT+'archives/get.php', params);
	}

	session(data, account_id) {
		let params = {
			params: {
				id:data['id'],
				book_author:data['authorName'],
				book_name:data['bookName'],
				is_completed:(data['isCompleted'] ? 1 : 0),
				minutes:data['minutes'],
				page_bookmark:data['pageBookmark'],
				status:data['status'],
				date_read:data['when'],
				user_id:data['userId'],
				account_id:account_id
			}
		};

		return this.httpClient.get(ApiProvider.API_ENDPOINT+'sessions/get.php', params);
	}
}
