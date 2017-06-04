import { Component , ElementRef , ViewChild} from '@angular/core';
import { NavController, NavParams , AlertController } from 'ionic-angular';
import { Internal } from '../../providers/internal'
import { External } from '../../providers/external'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterOwner } from '../../models/request'
import { Geolocation } from '@ionic-native/geolocation';
import { StorageSession } from '../../providers/storage-session'
import { LoginPage } from '../login/login'
declare var google ;
/*
  Generated class for the SignupOwner page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
interface Location {
  lat: string,
  lng: string;
}

@Component({
  selector: 'page-signup-owner',
  templateUrl: 'signup-owner.html'
})
export class SignupOwnerPage {
   @ViewChild('map') mapElement: ElementRef;

   map: any
   mapInitialised: boolean
   marker: any
   user: FormGroup
   myLatLng : any
   showResultDebug: string
   submitted: boolean
  provinces: Array<Object>

  constructor(public navCtrl: NavController,
   public navParams: NavParams ,
    private _internal : Internal , 
    private _external: External , 
    private _fb: FormBuilder , 
    private _storage: StorageSession , 
    private _alert :AlertController,
    private geolocation: Geolocation) {
    this.myLatLng = {
      lat: '',
      lng: ''
    }
    this.user = this._fb.group({
      email: ['' , [Validators.required]] ,
      shop_name: ['' , [Validators.required]] ,
      sub_district: ['' , [Validators.required]] ,
      district: ['' , [Validators.required]] ,
      firstname: ['' , [Validators.required]],
      surname: ['' , [Validators.required]],
      postal_code: ['' , [Validators.required]],
      phone_number: ['' , [Validators.required]],
      province: ['' , [Validators.required]],
      password: ['', [Validators.required]] ,
      shop_type: ['', [Validators.required]],
      address: ['', [Validators.required]],
      accept: [false , [Validators.required]]
    })
    this.submitted = false
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupOwnerPage');

    this._storage.get('facebookData')
    .then((data)=>{
      if(data != null) {
        var dataJson = JSON.parse(data)
        this.user.patchValue({email: dataJson.email})
        this.user.patchValue({firstname: dataJson.first_name})
        this.user.patchValue({surname: dataJson.last_name})
      }
    })

    this._internal.loadProvince()
    .subscribe(
      res => {
        var resJson = res.json()
        this.provinces = resJson['th']['changwats']
        console.log(this.provinces)
      }
    )
    this.marker = null
    this.showResultDebug = ""
    this.initMap();
  }

  initMap(){
 
    this.mapInitialised = true;
 
    this.geolocation.getCurrentPosition().then((position) => {
      // alert('Latitude:' + position.coords.latitude )
      // alert('Longitude:' + position.coords.longitude)
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('click', (e) => {
        var marker = new google.maps.Marker({
          position: e.latLng,
          map: this.map
        });
        this.myLatLng = {lat: e.latLng.lat() , lng: e.latLng.lng() }
        if(this.marker !== null) {
          this.marker.setMap(null)
          this.marker = null
          this.marker = marker
        }else{
          this.marker = marker
        }
      });
    });
 
  }

  clearMarker(){ 
    for(let i = 0; i < this.marker.length ; i++) {
      this.marker[i].setMap(null)
    }
  }

  loadgoogleMap() {
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      this.initMap()
    }else{
      setTimeout(()=>this.loadgoogleMap, 1000)
    }
  }


  register() {

    this.submitted = true 

    if(!this.user.valid || !this.user.controls['accept'].value || this.myLatLng == undefined) {
      return false;
    }


    var registerRequest: RegisterOwner = {
      email: this.user.controls['email'].value,
      shop_name: this.user.controls['shop_name'].value,
      shop_type: this.user.controls['shop_type'].value,
      firstname: this.user.controls['firstname'].value,
      surname: this.user.controls['surname'].value,
      phone_number: this.user.controls['phone_number'].value,
      sub_district: this.user.controls['sub_district'].value,
      province: this.user.controls['province'].value,
      password: this.user.controls['password'].value,
      district: this.user.controls['district'].value,
      address: this.user.controls['address'].value,
      latitude: this.myLatLng.lat,
      longitude: this.myLatLng.lng,
      type: 2,
      postal_code:  this.user.controls['postal_code'].value,
    }

    

    this._external.registerOwner(registerRequest)
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
