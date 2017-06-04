import { Component } from '@angular/core';
import { NavController, NavParams , ViewController} from 'ionic-angular';

/**
 * Generated class for the FullimagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-fullimage',
  templateUrl: 'fullimage.html',
})
export class FullimagePage {

  imgUrl: String

  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.imgUrl = this.navParams.get('imgUrl');
  } 

  dismiss(){
    this.viewCtrl.dismiss()
  }
}
