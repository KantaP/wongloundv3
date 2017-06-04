import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Paramservice } from '../../providers/paramservice'
import { External } from '../../providers/external'
import { ShopProfilePage } from '../shop-profile/shop-profile'
/*
  Generated class for the Favourite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favourite',
  templateUrl: 'favourite.html'
})
export class FavouritePage {

  favouriteShops: Array<any>
  loadFavouriteList: boolean

  constructor(public navCtrl: NavController, public navParams: NavParams , public _external : External , public _params: Paramservice) {
    this.favouriteShops = []
    this.loadFavouriteList =false
  }

  ionViewDidLoad() {
    this._external.getAllFavourite(this._params.paramsData.user_id)
    .subscribe(
      res => {
        var resJson = res.json()
        this.favouriteShops = resJson
        this.loadFavouriteList = true
      }
    )
  }

  goToShop(shop_id: number) {
    this.navCtrl.push(ShopProfilePage , {mode: 'view' , shop_id : shop_id})
  }

}
