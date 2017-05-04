import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PackagesService {

  constructor(private http:Http) {
    console.log('Package service initialized....');
  }

  getPackages(){
    return this.http.get('users/getallusers').map(res => res.json());
  }

}
