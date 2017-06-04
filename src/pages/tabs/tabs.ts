import { Component } from '@angular/core';
import { ProfilePage } from '../profile/profile'
import { ShopProfilePage } from '../shop-profile/shop-profile'
import { HomePage } from '../home/home';
import { FavouritePage } from '../favourite/favourite'
import { SearchPage } from '../search/search'
import { CashoutPage } from '../cashout/cashout'
import { StorageSession } from '../../providers/storage-session'
import { Paramservice } from '../../providers/paramservice'
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ProfilePage
  tab3Root: any =  ShopProfilePage
  tab4Root: any = FavouritePage
  tab5Root: any = SearchPage
  tab6Root: any = CashoutPage
  userType: number
  constructor(private _storage: StorageSession  , public paramservice: Paramservice) {
    
  }
  ionViewDidLoad(){
    this.userType = this.paramservice.paramsData.type
  }
}
