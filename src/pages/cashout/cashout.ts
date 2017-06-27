import { Component } from '@angular/core';
import {  NavController, NavParams , LoadingController , AlertController} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import * as moment from 'moment'
import { Paramservice } from '../../providers/paramservice'
import { External } from '../../providers/external'
/**
 * Generated class for the CashoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-cashout',
  templateUrl: 'cashout.html',
})
export class CashoutPage {

  positionSelected: Array<string>
  homeChecked: boolean
  typeChecked: boolean
  startDate: any
  endDate: any
  _moment: any

  constructor(public navCtrl: NavController, public navParams: NavParams , public iab: InAppBrowser , public param: Paramservice , public loadCtrl: LoadingController 
  , public _external: External , public alertCtrl: AlertController) {
    this.positionSelected = []
    this.homeChecked = true
    this.typeChecked = true
    this._moment = moment
  }

  ionViewDidLoad() {
  }

  positionSelect(position: string) {
    var index = this.positionSelected.findIndex(item => item == position)
    if(index < 0) {
      this.positionSelected.push(position)
    }
    else if(index >= 0) {
      this.positionSelected = this.positionSelected.filter(item => item != position)
    }
    
  }

  findPositionSelected(position: string) {
    var index = this.positionSelected.findIndex(item => item == position)
    if(index < 0) {
      return false;
    }
    else if(index >= 0) {return true;}
  }

  homeChange($e: any){
    if($e.checked) this.homeChecked = true
    else this.homeChecked = false
  }

  typeChange($e: any) {
    if($e.checked) this.typeChecked = true
    else this.typeChecked = false
  }

  stringGen(len)
  {
      var text = "";

      var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < len; i++ )
          text += charset.charAt(Math.floor(Math.random() * charset.length));

      return text;
  }

  goToHistory() {
    const browser = this.iab.create('http://128.199.210.96/stat/payment.php?shop_id='+this.param.paramsData.shop_id)
    browser.show()
  }

  goTopayment() {
    // calculate price 
    // for test use 1 baht 
    if(this.positionSelect.length == 0) {
      return false;
    }
    if(!this.startDate) return false
    if(!this.endDate) return false
    if(!this.homeChecked && !this.typeChecked) return false
    var paylink = {}
    var price_home = 150
    var price_type = 100

    var total_price = 0
    var position = ""
    var diffDate = this._moment(this.endDate, 'YYYY-MM-DD').diff(this._moment(this.startDate , 'YYYY-MM-DD') , 'days') + 1  
    for(let item of this.positionSelected) {
      position += item+','
      if(this.homeChecked) total_price += price_home * diffDate
      if(this.typeChecked) total_price += price_type * diffDate
    }
    // position = position.substr(0, position.length-1)
    paylink['price'] = total_price
    var type = ""
    if(this.homeChecked) type += 'home|'
    if(this.typeChecked) type += 'type|'
    paylink['type'] = type
    paylink['position'] = position
    paylink['start_date'] = this.startDate
    paylink['end_date'] = this.endDate
    paylink['shop_id'] = this.param.paramsData.shop_id;
    var invoice_id = this.stringGen(8)
    paylink['invoice_id'] = invoice_id
    paylink = btoa(JSON.stringify(paylink))
    

    const browser = this.iab.create('http://128.199.210.96/paysbuy/button.php?payment='+paylink)
    var loader = this.loadCtrl.create({
      content: "กรุณารอ",
    })
    loader.present()
    browser.show()
    browser.on('exit').subscribe(
      event => {
        var attempt = 0
        var timer = setInterval(()=> {
          this._external.checkInvoiceStatus(invoice_id)
          .subscribe(
            res => {
              var resJson = res.json()
              if(resJson.status == true) {
                let alert = this.alertCtrl.create({
                  title: 'แจ้งเตือน',
                  message: resJson.msg,
                  buttons: [
                    {
                      text: 'ตกลง',
                      handler: () => {
                      }
                    }
                  ]
                });
                loader.dismiss()
                clearInterval(timer)
                alert.present();
              }else {
                attempt++ 
                if(attempt == 5) {
                  let alert = this.alertCtrl.create({
                    title: 'แจ้งเตือน',
                    message: 'ยกเลิกการสั่งซื้อ',
                    buttons: [
                      {
                        text: 'ตกลง',
                        handler: () => {
                        }
                      }
                    ]
                  });
                  loader.dismiss()
                  clearInterval(timer)
                  alert.present();
                }
              }
            }
          )
        },200)
      }
    )
  }

}
