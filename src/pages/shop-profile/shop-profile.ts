import { Component , ElementRef , ViewChild} from '@angular/core';
import { NavController, NavParams , ActionSheetController, ToastController ,  Platform, LoadingController, Loading , AlertController , ModalController} from 'ionic-angular';
import { Paramservice } from '../../providers/paramservice'
import { Internal } from '../../providers/internal'
import { External } from '../../providers/external'
import { ShopRecommended , ShopPromotion} from '../../models/request'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer , TransferObject , FileUploadOptions } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { API_URL } from '../../providers/settings'
import { FullimagePage } from '../fullimage/fullimage'
declare var google , cordova;
/*
  Generated class for the ShopProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-shop-profile',
  templateUrl: 'shop-profile.html'
})
export class ShopProfilePage {
  @ViewChild('map') mapElement: ElementRef;

  map: any
  mapInitialised: boolean
  myLatLng: any
  marker: any
  editMode: boolean
  currentView: string
  mode: any
  recommended: string

  profile: any
  provinces: any
  createNewPro: boolean
  promotions : any
  _moment: any
  newPromotion: FormGroup
  api: string
  lastImage: any
  loading: any

  promotionImage: any
  promotionImageFileName: any
  promotionImageChange:boolean
  updatePromotion: boolean
  showSlide: boolean

  shopId: number
  readOnly: boolean
  userType: number
  checkFavourite: boolean
  checkRegisterActivity: boolean
  activityIcon: string
  activityOn: boolean
  favouriteIcon: string
  favouriteOn: boolean
  sliderOptions: any

  constructor(public navCtrl: NavController, public navParams: NavParams , public _param: Paramservice , 
  private _internal: Internal , private _external: External , private _fb: FormBuilder , public actionSheetCtrl: ActionSheetController, 
  public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController ,
  private _alert: AlertController , public camera: Camera , public filePath: FilePath , public modalCtrl: ModalController , public file: File , public transfer: Transfer) {
    this._moment = moment
    this.newPromotion = this._fb.group({
      promotion: ['' , [Validators.required]],
      description: ['' , [Validators.required]],
      promotionId: [0]
    })
    this.api = API_URL
    this.profile = {}
    this.promotionImage = ''
    this.updatePromotion = false
    this.promotionImageChange = false
    this.readOnly =false
    this.showSlide = false
    this.checkFavourite = false
    this.favouriteOn =false
    this.activityOn = false
    this.checkRegisterActivity = true
    this.activityIcon = "ios-hand-outline"
    this.sliderOptions = {
       pager: true
    }
  }

  showFullImage(imgUrl: string) {
    let modal = this.modalCtrl.create(FullimagePage, {imgUrl})
    modal.present();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ShopProfilePage');
    this.editMode = false
    this.currentView = 'recommended'
    this.mode = this.navParams.get('mode') || 'edit'
    this.userType = this._param.paramsData.type;
    if(this.mode == 'view') {
      this.shopId = this.navParams.get('shop_id')
      this._external.getShopProfile(this.shopId)
      .subscribe(
        res => {
          var resJson = res.json()
          this.profile = resJson
          for(let index = 1; index <= 10; index++) {
            if(this.profile[`shop_image_${index}`] != "") this.profile[`shop_image_${index}`] = this.api + 'images/' + this.profile[`shop_image_${index}`]
            else this.profile[`shop_image_${index}`] = 'assets/noimage.jpeg'
          } 
          this.showSlide = true
        }
      )
      this._external.incrementCountView(this.shopId)
      .subscribe(
        res => {
          var resJson = res.json()
          // console.log(resJson)
        }
      )
    }else {
      this.profile = this._param.paramsData
      this.shopId = this.profile.shop_id
      for(let index = 1; index <= 3; index++) {
        if(this.profile[`shop_image_${index}`] != "") this.profile[`shop_image_${index}`] = this.api + 'images/' + this.profile[`shop_image_${index}`]
        else this.profile[`shop_image_${index}`] = 'assets/noimage.jpeg'
      } 
      this.showSlide = true
    }
    
    // console.log(this.profile)
    // setTimeout(()=>this.initMap() , 2500)

     this._internal.loadProvince()
      .subscribe(
        res => {
          var resJson = res.json()
          this.provinces = resJson['th']['changwats']
          // console.log(this.provinces)
        }
      )

      if(this.mode == 'view' && this.userType == 1) {
        this._external.checkFavourite(this._param.paramsData.user_id , this.shopId)
        .subscribe(
          res => {
            var resJson = res.json()
            this.checkFavourite = true
            if(resJson['count']) {
              this.favouriteIcon = 'star'
              this.favouriteOn = true
            }else {
              this.favouriteIcon = 'star-outline'
              this.favouriteOn = false
            }
          }
        )
        this._external.checkActivity(this._param.paramsData.user_id , this.shopId)
        .subscribe(
          res => {
            var resJson = res.json()
            this.checkRegisterActivity = true
            if(resJson['count']) {
              this.activityIcon = 'ios-hand'
              this.activityOn = true
            }else {
              this.activityIcon = 'ios-hand-outline'
              this.activityOn = false
            }
          }
        )
      }
      
  }

  alert(message) {
    let alert = this._alert.create({
      title: 'แจ้งเตือน',
      message: message,
      buttons: [
        {
          text: 'ตกลง',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  toggleActivity() {
    if(this.activityOn) {
      this.activityIcon = 'ios-hand-outline'
      this.activityOn = false
      this._external.unsetActivity(this._param.paramsData.user_id , this.shopId)
      .subscribe(
        res => {
      
        },
        err => {
          this.activityIcon = 'star'
          this.activityOn = true
        }
      )

    }else{
      this.activityIcon = 'ios-hand'
      this.activityOn = true
      this._external.setActivity(this._param.paramsData.user_id , this.shopId)
      .subscribe(
        res => {
       
        },
        err => {
          this.activityIcon = 'star-outline'
          this.activityOn = false
        }
      )

    }
  }

  toggleFavourite() {
    if(this.favouriteOn) {
      this.favouriteIcon = 'star-outline'
      this.favouriteOn = false
      this._external.unsetFavouriteShop(this._param.paramsData.user_id , this.shopId)
      .subscribe(
        res => {
      
        },
        err => {
          this.favouriteIcon = 'star'
          this.favouriteOn = true
        }
      )

    }else{
      this.favouriteIcon = 'star'
      this.favouriteOn = true
      this._external.setFavouriteShop(this._param.paramsData.user_id , this.shopId)
      .subscribe(
        res => {
       
        },
        err => {
          this.favouriteIcon = 'star-outline'
          this.favouriteOn = false
        }
      )

    }
  }

  ionViewWillEnter(){
    this._external.findPromotionByShop(this.shopId)
    .subscribe(
      res => {
        var resJson = res.json()
        this.promotions = resJson.data
      }
    )
  }

  closePromotion(){
    this.readOnly = false
  }

  initMap() {
    try {
      let latLng = new google.maps.LatLng(this.profile.latitude || 13.736717 , this.profile.longitude || 100.523186);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      var marker = new google.maps.Marker({
          position: latLng,
          map: this.map
        });
      this.marker = marker
 
      
      this.map.addListener('click', (e) => {
        var marker = new google.maps.Marker({
          position: e.latLng,
          map: this.map
        });
        this.myLatLng = e.latLng
        if(this.marker !== null) {
          this.marker.setMap(null)
          this.marker = null
          this.marker = marker
        }else{
          this.marker = marker
        }
        this.profile.latitude = this.myLatLng.lat()
        this.profile.longitude = this.myLatLng.lng()
      });
    }catch(err) {
      setTimeout(()=>this.initMap , 1000)
    }
  }

  toggleView(view) {
    this.currentView = view
    if(view == 'profile' || view == 'map') setTimeout(()=>this.initMap() , 2500)
  }

  updateRecommended() {
    var request: ShopRecommended = {
      shop_id : this.profile.shop_id ,
      recommended : this.profile.recommended
    }

    this._external.updateShopRecommended(request)
    .subscribe(
      res => {
        var resJson = res.json()
        this.alert(resJson.updateShop[0])
        if(this.mode == 'edit'){
          this._param.paramsData.recommended = this.profile.recommended
          this._param.updateProfile()
        }
        
      }
    )
  }

  showFormAddPro(){
    this.createNewPro = true
  }

  hideFormAddPro() {
    this.createNewPro = false
    this.updatePromotion = false
  }

  showPromotionDetail(promotionIndex: number , readOnly: boolean = false) {
    if(!readOnly) this.updatePromotion = true
    else this.readOnly = true
    this.newPromotion.patchValue({
      promotion: this.promotions[promotionIndex].promotion,
      description: this.promotions[promotionIndex].description,
      promotionId: this.promotions[promotionIndex].promotion_id
    })
    this.promotionImage = this.promotions[promotionIndex].image_promotion || 'assets/noimage.jpeg'
  }
  
  updateShopProfile() {
    this._external.updateShopProfile(this.profile)
    .subscribe(
      res => {
        var resJson = res.json()
        this.alert(resJson.updateShop.text)
        if(resJson.updateShop.number) {
          if(this.mode == 'edit') {
            this._param.paramsData = this.profile
            this._param.updateProfile()
          }

        }
      }
    )
  }

  createPromotion() {
    this.createNewPro = false
    if(!this.newPromotion.valid) {
      return false
    }
    this.loading = this.loadingCtrl.create({
      content: 'กำลังสร้างโปรโมชั่น',
    });
    this.loading.present();
    this._external.createShopPromotion({
      promotion: this.newPromotion.controls['promotion'].value,
      description: this.newPromotion.controls['description'].value,
      shop_id: this.profile.shop_id,
      promotion_id: 0
    })
    .subscribe(
      res => {
        var resJson = res.json()
        // console.log(resJson)
        // alert(resJson['result_text'])
        this.loading.dismissAll()
        if(resJson['result_number'] == 1) {
          this.alert('เพิ่มโปรโมชั่นสำเร็จ')
          this._external.findPromotionByShop(this.profile.shop_id)
          .subscribe(
            res => {
              var resJson = res.json()
              this.promotions = resJson.data
            }
          )
        }
      }
    )
  }

  createPromotionWithImage() {
    this.createNewPro = false
    if(!this.newPromotion.valid) {
      return false
    }
    // Destination URL
    var url = API_URL + 'shop/createPromotion';
  
    // File for Upload
    var targetPath = this.pathForImage(this.promotionImageFileName);
  
    // File name only
    var filename = this.promotionImageFileName;
  
    var options = {
      fileKey: "image_promotion",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
        promotion: this.newPromotion.controls['promotion'].value,
        description: this.newPromotion.controls['description'].value,
        shop_id: this.profile.shop_id
      }
    };

    // alert(JSON.stringify(options))

    const fileTransfer: TransferObject = this.transfer.create();
  
    this.loading = this.loadingCtrl.create({
      content: 'กำลังสร้างโปรโมชั่น',
    });
    this.loading.present();
  
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(()=>{
      this.loading.dismissAll()
      this.alert('เพิ่มโปรโมชั่นสำเร็จ')
      this._external.findPromotionByShop(this.profile.shop_id)
        .subscribe(
          res => {
            var resJson = res.json()
           this.promotions = resJson.data
           }
        )
    },err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
      // alert(JSON.stringify(err))
    })
  }
  
  editPromotion() {
    this.updatePromotion = false
    if(!this.newPromotion.valid) {
      return false
    }
    this.loading = this.loadingCtrl.create({
      content: 'กำลังแก้ไขโปรโมชั่น',
    }); 
    this.loading.present();
    this._external.updateShopPromotion({
      promotion: this.newPromotion.controls['promotion'].value,
      description: this.newPromotion.controls['description'].value,
      shop_id: this.profile.shop_id,
      promotion_id: this.newPromotion.controls['promotionId'].value
    })
    .subscribe(
      res => {
        var resJson = res.json()
        // console.log(resJson)
        // alert(resJson['result_text'])
        this.loading.dismissAll()
        if(resJson['result_number'] == 1) {
          this.alert('แก้ไขโปรโมชั่นสำเร็จ')
          this._external.findPromotionByShop(this.profile.shop_id)
          .subscribe(
            res => {
              var resJson = res.json()
              this.promotions = resJson.data
            }
          )
        }
      }
    )
  }

  editPromotionWithImage(){
    this.updatePromotion = false
    if(!this.newPromotion.valid) {
      return false
    }
    // Destination URL
    var url = API_URL + 'shop/updatePromotion';
  
    // File for Upload
    var targetPath = this.pathForImage(this.promotionImageFileName);
  
    // File name only
    var filename = this.promotionImageFileName;
  
    var options = {
      fileKey: "image_promotion",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
        promotion: this.newPromotion.controls['promotion'].value,
        description: this.newPromotion.controls['description'].value,
        shop_id: this.profile.shop_id,
        promotion_id: this.newPromotion.controls['promotionId'].value
      }
    };

    // alert(JSON.stringify(options))

    const fileTransfer: TransferObject = this.transfer.create();
  
    this.loading = this.loadingCtrl.create({
      content: 'กำลังแก้ไขโปรโมชั่น',
    });
    this.loading.present();
  
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(()=>{
      this.loading.dismissAll()
      this.alert('แก้ไขโปรโมชั่นสำเร็จ')
      this._external.findPromotionByShop(this.profile.shop_id)
        .subscribe(
          res => {
            var resJson = res.json()
           this.promotions = resJson.data
           }
        )
    },err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
      // alert(JSON.stringify(err))
    })
  }

  uploadShopImage(Imageindex: number) {
    // Destination URL
    var url = API_URL + 'shop/uploadImageShop';
  
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
  
    // File name only
    var filename = this.lastImage;
  
    var options = {
      fileKey: "shop_image_"+Imageindex,
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
        shop_id: this.profile.shop_id,
        image_field: "shop_image_"+Imageindex
      }
    };

    // alert(JSON.stringify(options))

    const fileTransfer: TransferObject = this.transfer.create();
  
    this.loading = this.loadingCtrl.create({
      content: 'กำลังอัพโหลดรูป',
    });
    this.loading.present();
  
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(()=>{
      this.loading.dismissAll()
      this._param.paramsData = this.profile
      this._param.updateProfile()
    },err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
      // alert(JSON.stringify(err))
    })
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public takePicture(sourceType , imagesId) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
    };
  
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            if(this.createNewPro || this.updatePromotion) this.copyFileToLocalDir2(correctPath , currentName , this.createFileName() , imagesId)
            else this.copyFileToLocalDir(correctPath, currentName, this.createFileName() ,imagesId);
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        if(this.createNewPro || this.updatePromotion) this.copyFileToLocalDir2(correctPath , currentName , this.createFileName() , imagesId)
        else this.copyFileToLocalDir(correctPath, currentName, this.createFileName() ,imagesId);
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  public presentActionSheet(imagesId: number = 0) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY , imagesId);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA , imagesId);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

    // Create a new name for the image
private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
  
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName , imagesId) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.profile[`shop_image_${imagesId}`] = this.pathForImage(this.lastImage);
      this.uploadShopImage(imagesId)
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }


  private copyFileToLocalDir2(namePath , currentName , newFileName ,imagesId ) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.promotionImageFileName = newFileName;
      this.promotionImage = this.pathForImage(this.promotionImageFileName);
      if(imagesId == 4) {
        this.promotionImageChange = true
      }
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
  
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
 