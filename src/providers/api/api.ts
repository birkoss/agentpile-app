import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiProvider {

  constructor(private http:Http) {
    console.log('Hello ApiProvider Provider');
  }

  getAccount(data) {
  	console.log(data);

  	return this.http.get('https://agentpile.com/api/accounts/get.php').map(res => res.json())
  		.subscribe(
  			value => {
  				console.log(value);
  			},
  			error => {
  				console.log(error);
  			}
  		);
  }
}
