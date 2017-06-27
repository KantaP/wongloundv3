import { Component } from '@angular/core';
import { NavController, NavParams , AlertController } from 'ionic-angular';
import { SignupTypePage } from '../signup-type/signup-type'
import { Login } from '../../models/request'
import { External } from '../../providers/external'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainPage } from '../main/main'
import { Facebook } from '@ionic-native/facebook';
import { Paramservice } from '../../providers/paramservice'
import { StorageSession } from '../../providers/storage-session'
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  submitted: boolean
  userProfile: any
  loginForm : FormGroup
  constructor(public navCtrl: NavController, 
  public navParams: NavParams ,
   private _external : External , 
   private _fb: FormBuilder , 
   private _storage: StorageSession , 
   private _alert: AlertController,
   public facebook: Facebook,
   public param: Paramservice) {
    this.loginForm = this._fb.group({
      email: ['' , [Validators.required]],
      password: ['' , [Validators.required]]
    })
    this.submitted = false
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this._storage.remove('facebookAuth')
    this._storage.remove('facebookData')
    this._storage.get('userProfile')
    .then((data)=>{
      if(data != null) {
        this.navCtrl.setRoot(MainPage,{userProfile:data})
      }
    })
  }

  gotoRegister() {
    this.navCtrl.push(SignupTypePage) 
  }


  login () {
    this.submitted = true
    if(!this.loginForm.valid) {
      return false
    }

    var loginRequest: Login = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value
    }

    this._external.login(loginRequest)
    .subscribe(
      res => {
        var resJson = res.json()
        if(resJson['data'] == null) {
          let alert = this._alert.create({
          title: 'แจ้งเตือน',
          message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
          buttons: [
            {
              text: 'ตกลง',
              handler: () => {
              }
            }
          ]
        });
        alert.present();
        }else{
          // save to storage do it later
          this._storage.set('userProfile' , resJson['data'])
          this.param.paramsData = resJson['data']
          this.navCtrl.setRoot(MainPage , {userProfile:resJson['data']})
        }
      }
    )
  }

  facebookRegister(){
      this.facebook.login(['email']).then( (response) => {
          // console.log(response)
          var expiration_date : any = new Date();
          expiration_date.setSeconds(expiration_date.getSeconds() + response.authResponse.expiresIn);
          expiration_date = expiration_date.toISOString();
          var facebookAuthData = {
            "id": response.authResponse.userID,
            "access_token": response.authResponse.accessToken,
            "expiration_date": expiration_date
          };
          this._storage.set('facebookAuth' , JSON.stringify(facebookAuthData))
          this.facebook.api(response.authResponse.userID + '/?fields=id,email,first_name,last_name', []).then((data)=>{
            this._storage.set('facebookData', JSON.stringify(data))
            .then(()=>{
              this.navCtrl.push(SignupTypePage)
            })
          })
      }).catch((error) => { console.log(error) });
  }
}
