import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http'


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiProvider {

	public static API_ENDPOINT='https://agentpile.com/api/';

	constructor(private httpClient:HttpClient, private http:Http) { }

	getAccount(data) {
		console.log(data);
		let params = {
			params: {
				token:data['token'],
				platform:data['platform']
			}
		};

		return this.httpClient.get(ApiProvider.API_ENDPOINT+'accounts/get.php', params);
	}
}
