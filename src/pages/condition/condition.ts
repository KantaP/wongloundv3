import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController } from 'ionic-angular';

/**
 * Generated class for the ConditionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-condition',
  templateUrl: 'condition.html',
})
export class ConditionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConditionPage');
  }

  dismiss(val) {
    let data = { 'result': val };
    this.viewCtrl.dismiss(data);
  }
}
