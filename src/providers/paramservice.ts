import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { StorageSession } from './storage-session'
/*
  Generated class for the Paramservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Paramservice {
  public paramsData: any;
  public provinceSelected: Subject<string>;
  public provinceValue: any
  constructor(public http: Http , private _storage: StorageSession) {
    this.paramsData = {}
    this.provinceSelected = new Subject<string>()
    this.provinceSelected.subscribe(
      data => {
        this.provinceValue = data
      }
    )
    // console.log('Hello Paramservice Provider');
  } 

  updateProfile() {
    this._storage.set('userProfile' , this.paramsData)
  }
}
