import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage'
/*
  Generated class for the StorageSession provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StorageSession {

  constructor(public http: Http , private _storage: Storage) {
    console.log('Hello StorageSession Provider');
  }

  set(key:string , data: string) {
    return this._storage.set(key,data)
  }

  get(key:string) {
    return this._storage.get(key)
  }

  remove(key:string) {
    return this._storage.remove(key)
  }

  clear(){
    return this._storage.clear()
  }

}
