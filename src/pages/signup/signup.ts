import { Component } from '@angular/core';
import { NavController, NavParams , AlertController } from 'ionic-angular';
import { Internal } from '../../providers/internal'
import { External } from '../../providers/external'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterUser } from '../../models/request'
import { StorageSession } from '../../providers/storage-session'
import { LoginPage } from '../login/login'
/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
}) 
export class SignupPage {

  provinces : Array<Object>
  user: FormGroup
  submitted: boolean

  constructor(public navCtrl: NavController, public navParams: NavParams , private _internal : Internal , private _external: External , private _fb: FormBuilder , private _storage: StorageSession , private _alert: AlertController) {

    // province: ['' , [Validators.required]],
    this.user = this._fb.group({
      email: ['' , [Validators.required]] ,
      firstname: ['' , [Validators.required]],
      gender: ['' , [Validators.required]],
      phone: ['' , [Validators.required]],
      password: ['', [Validators.required]] ,
      accept: [false , [Validators.required]]
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');

    this._storage.get('facebookData')
    .then((data)=>{
      if(data != null) {
        var dataJson = JSON.parse(data)
        this.user.patchValue({email: dataJson.email})
        this.user.patchValue({firstname: dataJson.first_name})
      }
    })

    // this._internal.loadProvince()
    // .subscribe(
    //   res => {
    //     var resJson = res.json()
    //     this.provinces = resJson['th']['changwats']
    //   }
    // )
  }

  register() {
    this.submitted = true
    if(!this.user.valid || !this.user.controls['accept'].value) {
      return false;
    }

    //province: this.user.controls['province'].value,
    var registerUser: RegisterUser = {
      email: this.user.controls['email'].value,
      firstname: this.user.controls['firstname'].value,
      phone_number: this.user.controls['phone'].value,
      sex: this.user.controls['gender'].value,
      password: this.user.controls['password'].value,
      type: 1
    }

    this._external.registerUser(registerUser)
    .subscribe(
      res => {
        var resJson = res.json()
        if(resJson.data !== null) {
          let alert = this._alert.create({
            title: 'แจ้งเตือน',
            message: 'สมัครสมาชิกสำเร็จ',
            buttons: [
              {
                text: 'ตกลง',
                handler: () => {
                  this.navCtrl.setRoot(LoginPage)
                }
              }
            ]
          });
          alert.present();
        }
      }
    )
  }

}
