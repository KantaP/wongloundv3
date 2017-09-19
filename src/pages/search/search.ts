import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Paramservice } from '../../providers/paramservice'
import { External } from '../../providers/external'
import { ShopProfilePage } from '../shop-profile/shop-profile'
import * as lodash from 'lodash'
/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  searchResult: Array<any>
  keys: Array<any>
  _lodash: any
  keys2: Array<any>
  province: any

  constructor(public navCtrl: NavController, public navParams: NavParams , public _external: External , public _param: Paramservice) {
    this.province = this._param.provinceValue
    
  }

  ionViewDidLoad() {
    this.searchResult = []
    this._lodash = lodash
    this.keys = []
    this.keys2 = []
    this.getShop('')
    this._param.getProvince().subscribe(
      data => {
        this.province = data
        this.getShop('')
      }
    )
    
  }

  goToShop(shop_id: number) {
    this.navCtrl.push(ShopProfilePage , {mode: 'view' , shop_id : shop_id})
  }

  getShop(ev: any) {
    this.searchResult = []
    this.keys = []
    this.keys2 = []
    let val = ""
    if(ev) {
      val = ev.target.value;
    }
     
    this._external.searchShop(val,this.province)
    .subscribe(
      res => {
        var resJson = res.json()
        this.searchResult = resJson
        if(this.searchResult.length > 0) {
          this.searchResult = this._lodash.groupBy(this.searchResult , (item)=>item.province)    
            for(let key in this.searchResult) {
              this.keys.push(key)
              this.searchResult[key] = this._lodash.groupBy(this.searchResult[key], (item)=>item.district)
              for(let district in this.searchResult[key]) {
                this.keys2.push(district)
              }
            }
            // console.log(this.keys , this.keys2)
        }
        
      }
    )
  }

}
