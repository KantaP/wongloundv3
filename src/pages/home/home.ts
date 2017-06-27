import { Component , ElementRef , ViewChild} from '@angular/core';
import { ShopProfilePage } from '../shop-profile/shop-profile'
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { External } from '../../providers/external';
import { API_URL } from '../../providers/settings'
import { Paramservice } from '../../providers/paramservice'
import { Internal } from '../../providers/internal'
import * as moment from 'moment'
import { Slides } from 'ionic-angular';
declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('featureslides') slides: Slides;
  map: any
  mapInitialised: boolean
  marker: Array<any>
  currentView: string
  sliderOptions: any;
  myLatLng: any
  api_url: string
  topFeatures: any
  recommendedShop: any
  luckyList: any
  province: any
  provinces: any
  normalShopList: Array<any>
  _moment: any
  luckyShops: any
  luckyPerson : any
  normalPage: number
  
  sliderObservable:any

  constructor(public navCtrl: NavController ,
  public _external: External , 
  public _param: Paramservice, 
  public _internal: Internal,
  public geolocation: Geolocation) {
    this.sliderOptions = {
       pager: true
    }
    this.api_url = API_URL
    this.topFeatures = []
    this.recommendedShop = []
    this.luckyList = []
    this.province = ''
    this.provinces = []
    this.marker = []
    this.normalShopList = []
    this._moment = moment
    this.luckyShops = []
    this.luckyPerson = [] 
    this.normalPage = 1
    this.currentView = 'shop'
  }

  toggle(view: string) {
    if(this.currentView != view) this.currentView = view
    else this.currentView = 'shop'
    
    // if(this.currentView = 'shop') this.initMap()
  }

  loadgoogleMap() {
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      this.initMap()
    }else{
      setTimeout(()=>this.loadgoogleMap, 1000)
    }
  }

  goToShop(shop_id: number) {
    this.navCtrl.push(ShopProfilePage , {mode: 'view' , shop_id : shop_id})
  }


  loadAd() {
    this._external.getFeaturesShop(this.province)
    .subscribe(
      res => {
        var resJson = res.json()
        this.topFeatures = resJson;
        for(let feature of this.topFeatures) {
          let latLng = new google.maps.LatLng(feature.latitude, feature.longitude);
          let marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            title: feature.shop_name ,
            content:`<div>` + feature.shop_name + ` 
                      <a href="tel:${feature.phone_number}">${feature.phone_number}</a><br/>
                      <a href="http://maps.google.com/maps?q=${feature.latitude},${feature.longitude}">ดูใน google map </a>
                    </div>`
          })
           marker.addListener('click', function(){
                    this.map.infowindow.setContent(marker.content);
                    this.map.infowindow.open(this.map,marker);

          });
          this.marker.push(marker)
        }
      }
    )
    this._external.getRecommendedShop(this.province)
    .subscribe(
      res => {
        var resJson = res.json()
        this.recommendedShop = resJson;
        for(let shop of this.recommendedShop) {
          let latLng = new google.maps.LatLng(shop.latitude, shop.longitude);
          let marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            title: shop.shop_name,
            content: `<div>` + shop.shop_name + ` 
                        <a href="tel:${shop.phone_number}">${shop.phone_number}</a><br/>
                        <a href="http://maps.google.com/maps?q=${shop.latitude},${shop.longitude}">ดูใน google map </a>
                      </div>`
          })
         marker.addListener('click', function(){
                    this.map.infowindow.setContent(marker.content);
                    this.map.infowindow.open(this.map,marker);

          });
          this.marker.push(marker)
        }
      }
    )
    this.loadNormalShop()
    this._external.getLucky(this.province)
    .subscribe(
      res => {
        var resJson = res.json()
        this.luckyList = resJson
      }
    )
    this._external.getluckyToday(this.province)
    .subscribe(
      res => {
        var resJson = res.json()
        this.luckyPerson = resJson.data
      }
    )
    this.loadActivityShops()
  }

  showNormalShop() {
    var newArr = []
    var total = this.normalPage * 5
    for(let i = 0; i < total; i++) {
      if(this.normalShopList[i]) {
        newArr.push(this.normalShopList[i])
      }

    }
    return newArr
  }

  nextPage() {
    this.normalPage += 1
  }

  loadNormalShop(type = 0) {
    
    this._external.getNormalShop(this.province, type)
    .subscribe(
      res => {
        var resJson = res.json()
        this.normalShopList = resJson
        for(let normalshop of this.normalShopList) {
  
          let latLng = new google.maps.LatLng(normalshop.latitude, normalshop.longitude);
          let marker = new google.maps.Marker({ 
            position: latLng,
            map: this.map,
            title: normalshop.shop_name ,
            content: `<div>` + normalshop.shop_name + ` 
                        <a href="tel:${normalshop.phone_number}">${normalshop.phone_number}</a><br/>
                        <a href="http://maps.google.com/maps?q=${normalshop.latitude},${normalshop.longitude}">ดูใน google map </a>
                      </div>`
          })

           marker.addListener('click', function(){
                    this.map.infowindow.setContent(marker.content);
                    this.map.infowindow.open(this.map,marker);

          });

          this.marker.push(marker)
        }
      }
    )
  }

  loadActivityShops() {
    this._external.activityShops(this.province) 
    .subscribe(
      res => {
        var resJson = res.json()
        this.luckyShops = resJson
      }
    )
  }

  ionViewWillEnter() {

    this.initMap()
    this._param.provinceSelected.subscribe(
      data => {
        this.province = data
        this.loadAd()
    })

    this.sliderObservable = setInterval(()=>{
        this.autoPlaySlider()
      },3000)

  }

  autoPlaySlider(){
    if(this.currentView != 'activity') {
      if(this.topFeatures.length > 0) {
        var slider_index = this.slides.getActiveIndex();
        if(slider_index < this.topFeatures.length){
            this.slides.slideTo(slider_index+1);
        }
        else{
            this.slides.slideTo(0);
        }
      }
    }
    
  }

  ionViewDidLeave() {
    clearInterval(this.sliderObservable)
  }

  // ionViewDidLoad() {
  //     this.sliderObservable = setInterval(()=>{
  //       this.autoPlaySlider()
  //     },3000)
  // }

  searchByType(type) {
    this.toggle('shop')
    this.clearMarker()
    this._external.getShopByType(type, this.province)
    .subscribe(
      res => {
        var resJson = res.json()
        this.recommendedShop = resJson;
        for(let shop of this.recommendedShop) {
          let latLng = new google.maps.LatLng(shop.latitude, shop.longitude);
          let marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            title: shop.shop_name,
            content: `<div>` + shop.shop_name + ` 
                        <a href="tel:${shop.phone_number}">${shop.phone_number}</a><br/>
                        <a href="http://maps.google.com/maps?q=${shop.latitude},${shop.longitude}">ดูใน google map </a>
                      </div>`
          })
         marker.addListener('click', function(){
                    this.map.infowindow.setContent(marker.content);
                    this.map.infowindow.open(this.map,marker);

          });
          this.marker.push(marker)
        }
      }
    )

    this._external.getShopFeatureByType(type , this.province)
    .subscribe(
      res => {
        var resJson = res.json()
        this.topFeatures = resJson
        for(let feature of this.topFeatures) {
          let latLng = new google.maps.LatLng(feature.latitude, feature.longitude);
          let marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            title: feature.shop_name ,
            content:`<div>` + feature.shop_name + ` 
                      <a href="tel:${feature.phone_number}">${feature.phone_number}</a><br/>
                      <a href="http://maps.google.com/maps?q=${feature.latitude},${feature.longitude}">ดูใน google map </a>
                    </div>`
          })
           marker.addListener('click', function(){
                    this.map.infowindow.setContent(marker.content);
                    this.map.infowindow.open(this.map,marker);

          });
          this.marker.push(marker)
        }
      }
    )
    this.loadNormalShop(type)
    
  }

  initMap() {
    this.map = null
    this.marker = []
    this.geolocation.getCurrentPosition().then((position) => {
      // alert('Latitude:' + position.coords.latitude )
      // alert('Longitude:' + position.coords.longitude)
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
   
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + 'E6C12F',
                      new google.maps.Size(21, 34),
                      new google.maps.Point(0,0),
                      new google.maps.Point(10, 34));
      // alert('map')
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      var marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        icon: pinImage,
      });

      this.map.infowindow = new google.maps.InfoWindow();

      this._external.searchAddressByLatlng(`${position.coords.latitude},${position.coords.longitude}`)
      .subscribe(
        res => {
          var data = res.json() 
          var province = ''
          data = data.results.filter(item => item.types.includes('sublocality_level_1'))
          province = data[0].address_components.filter(item => item.types.includes("administrative_area_level_1"))
          this.province = province[0]['short_name'].replace('จ.','')
          // console.log(this._param.provinceSelected)
          this._param.provinceSelected.next(this.province)
          // this.loadAd()
        }
      )
      // this.map.addListener('click', (e) => {
      //   var marker = new google.maps.Marker({
      //     position: e.latLng,
      //     map: this.map
      //   });
      //   this.myLatLng = e.latLng
      //   if(this.marker !== null) {
      //     this.marker.setMap(null)
      //     this.marker = null
      //     this.marker = marker
      //   }else{
      //     this.marker = marker
      //   }
      // });
    });
  }

  clearMarker() {
    for(let i = 0 ; i < this.marker.length; i++){
      this.marker[i].setMap(null)
    }
    this.marker = []
  }
}
