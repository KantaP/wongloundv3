import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Paramservice } from '../../providers/paramservice'
import { EmailComposer } from '@ionic-native/email-composer';
/*
  Generated class for the Report page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  profile: any
  message: any

  constructor(public navCtrl: NavController, public navParams: NavParams , private _param: Paramservice , public email: EmailComposer) {}

  ionViewDidLoad() {
    this.profile = this._param.paramsData
    this.message = ""
  }

  sendReport() {
    this.email.open({
        to:      'wonglao.report@gmail.com',
        subject: 'แจ้งปัญหา',
        body:    this.message,
        isHtml:  true
    });
  }

}
