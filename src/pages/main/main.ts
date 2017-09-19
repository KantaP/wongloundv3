import { Component } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'
import { ProfilePage } from '../profile/profile'
import { ReportPage } from '../report/report'
import { LoginPage } from '../login/login'
import { StorageSession } from '../../providers/storage-session'
import { Paramservice } from '../../providers/paramservice'
import { External } from '../../providers/external'
import { ContactPage } from '../contact/contact'
import { ConditionPage } from '../condition/condition'
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
  private contactPage;

  constructor(public navCtrl: NavController, public navParams: NavParams , private _storage: StorageSession , public paramservice: Paramservice , public _external: External , public _modal: ModalController) {
    //this.rootPage = TabsPage;
    this.homePage = TabsPage;
    this.profilePage = ProfilePage
    this.reportPage = ReportPage
    this.contactPage = ContactPage
    
    if(this.paramservice.paramsData.type == 2) this.showCountView = true
    else this.showCountView = false
    this.provinces = []
    // console.log(this.navParams.get('userProfile'))
  }

  showUserPicture() {
    if(this.paramservice.paramsData.type == 1) {
      return (this.paramservice.paramsData.profile_picture == '')? 'assets/icon/user.jpg' : this._external.loadImage(this.paramservice.paramsData.profile_picture)
    }else{
      return (!this.paramservice.paramsData.shop_image_1) ? 'assets/icon/user.jpg'  : this._external.loadImage(this.paramservice.paramsData.shop_image_1) 
    }
  }

  paramText() {
    return JSON.stringify(this.paramservice.paramsData)
  }

  showUserName() {
    if(this.paramservice.paramsData.type == 1) {
      return this.paramservice.paramsData.firstname
    }else{
      return this.paramservice.paramsData.shop_name
    }
  } 

  ionViewDidLoad() {
    this._storage.get('alreadyReadCondition')
    .then((data)=>{
      if(data == null) {
        let modal = this._modal.create(ConditionPage);
        modal.present();
        modal.onDidDismiss(data => {
          if(data.result == 'accept') {
            this.rootPage = TabsPage
            this._storage.set('alreadyReadCondition',"true")
            //this.paramservice.paramsData = this.navParams.get('userProfile') 
            this._external.findProvince()
            .subscribe(
              res => {
                var resJson = res.json()
                this.provinces = resJson
                
              }
            )
            this.paramservice.getProvince().subscribe((data)=>{
                this.province = data
              })
          }
        });
      }else{
        this.rootPage = TabsPage
        this._external.findProvince()
        .subscribe(
          res => {
            var resJson = res.json()
            this.provinces = resJson
            
          }
        )
        this.paramservice.getProvince().subscribe((data)=>{
            this.province = data
          })
      }
    })
  }
  provinceSelect($ev) {
    this.paramservice.setProvince($ev)
  }

  openPage(p) {
    this.rootPage = p;
  }

  signOut() {
    this._storage.remove('userProfile')
    this.paramservice.setInitialProfile()
    this.paramservice.setUserData({type:3})
  }

  goToReport() {
    this.navCtrl.push(ReportPage)
  }

  goToContact() {
    this.navCtrl.push(ContactPage)
  }

  signIn() {
    this.navCtrl.push(LoginPage)
  }
}
