import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignupOwnerPage } from '../signup-owner/signup-owner';
import { SignupPage } from '../signup/signup'
/*
  Generated class for the SignupType page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup-type',
  templateUrl: 'signup-type.html'
})
export class SignupTypePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupTypePage');
  }

  gotoSignUser(){
    this.navCtrl.push(SignupPage)
  }

  gotoSignOwner(){
    this.navCtrl.push(SignupOwnerPage)
  }

}
