import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'
import { ProfilePage } from '../profile/profile'
import { ReportPage } from '../report/report'
import { LoginPage } from '../login/login'
import { StorageSession } from '../../providers/storage-session'
import { Paramservice } from '../../providers/paramservice'
import { Internal } from '../../providers/internal'
/*
  Generated class for the Main page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {


  private rootPage;
  private homePage;
  private profilePage;
  private showCountView;
  private province;
  private provinces; 
  private reportPage;
  constructor(public navCtrl: NavController, public navParams: NavParams , private _storage: StorageSession , public paramservice: Paramservice , public _internal: Internal) {
    this.rootPage = TabsPage;
    this.homePage = TabsPage;
    this.profilePage = ProfilePage
    this.reportPage = ReportPage
    this.paramservice.paramsData = this.navParams.get('userProfile')
    if(this.paramservice.paramsData.type == 2) this.showCountView = true
    else this.showCountView = false
    this.provinces = []
    // console.log(this.navParams.get('userProfile'))
  }

  ionViewDidLoad() {
    this._internal.loadProvince()
    .subscribe(
      res => {
        var resJson = res.json()
        this.provinces = resJson['th']['changwats']
      }
    )
    this.paramservice.provinceSelected.subscribe((data)=>this.province = data)
  }

  provinceSelect() {
    // console.log(this.paramservice.provinceSelected)
    this.paramservice.provinceSelected.next(this.province)
  }

  openPage(p) {
    this.rootPage = p;
  }

  signOut() {
    this._storage.remove('userProfile')
    this.navCtrl.setRoot(LoginPage)
  }

  goToReport() {
    this.navCtrl.push(ReportPage)
  }
}
