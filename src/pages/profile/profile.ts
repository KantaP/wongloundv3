import { Component } from '@angular/core';
import { NavController, NavParams , ActionSheetController, ToastController ,  Platform, LoadingController, Loading } from 'ionic-angular';
import { StorageSession } from '../../providers/storage-session'
import { UpdateUser } from '../../models/request'
import { External } from '../../providers/external'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer , TransferObject , FileUploadOptions } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

import { API_URL } from '../../providers/settings'
import { Paramservice } from '../../providers/paramservice'
declare var cordova
/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  // userProfile: any
  editMode: boolean
  profileGroup: FormGroup
  userId: number
  lastImage: any
  loading: any
  imageProfile: any
  changeImage: boolean
  imageName: any

  constructor(public navCtrl: NavController, public navParams: NavParams , private _storage : StorageSession , private _external: External , private _fb: FormBuilder ,
  public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController,
   public platform: Platform, public loadingCtrl: LoadingController ,
    public _param: Paramservice , public camera: Camera , public filePath: FilePath
    ,public file: File , public transfer: Transfer) {
    // this.userProfile = {
    //   firstname: '',
    //   surname: '',
    //   sex: '',
    //   phone_number: '',
    //   email: ''
    // }
    this.editMode = false
    this.lastImage = ""
    this.userId = 0
    this.imageProfile = ""
    this.imageName = ""
    this.profileGroup = this._fb.group({
      firstname: [this._param.paramsData.firstname , [Validators.required]],
      surname: [this._param.paramsData.surname , [Validators.required]] ,
      sex: [this._param.paramsData.sex , [Validators.required]],
      phone_number: [this._param.paramsData.phone_number , [Validators.required]],
      email: [this._param.paramsData.email , [Validators.required]]
    })
    this.changeImage = false
    this.userId = this._param.paramsData.user_id
    this.imageName = this._param.paramsData.profile_picture
    this.imageProfile = (this._param.paramsData.profile_picture == '') ? 'assets/icon/user.jpg' : API_URL + 'images/' + this._param.paramsData.profile_picture
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  updateProfile() {

    // if(confirm('คุณต้องการอัพเดตข้อมูลใหม่หรือไหม ?')){
      var profileRequest: UpdateUser = {
        firstname: this.profileGroup.controls['firstname'].value,
        surname: this.profileGroup.controls['surname'].value,
        sex: this.profileGroup.controls['sex'].value,
        phone_number: this.profileGroup.controls['phone_number'].value,
        email: this.profileGroup.controls['email'].value,
        // profile_picture: this.imageProfile,
        user_id : this.userId
      }
      this._external.updateProfile(profileRequest)
      .subscribe(
        res => {
          var resJson = res.json()
          this.presentToast(resJson['updateUser'])
          this._param.paramsData['firstname'] = this.profileGroup.controls['firstname'].value
          this._param.paramsData['surname'] = this.profileGroup.controls['surname'].value
          this._param.paramsData['sex'] = this.profileGroup.controls['sex'].value
          this._param.paramsData['phone_number'] = this.profileGroup.controls['phone_number'].value
          this._param.paramsData['email'] = this.profileGroup.controls['email'].value
          this._param.paramsData['profile_picture'] = this.imageName
          //   this._storage.set('userProfile' , data)
          // this._storage.get('userProfile')
          // .then((data)=>{
          //   data['firstname'] = this.profileGroup.controls['firstname'].value
          //   data['surname'] = this.profileGroup.controls['surname'].value
          //   data['sex'] = this.profileGroup.controls['sex'].value
          //   data['phone_number'] = this.profileGroup.controls['phone_number'].value
          //   data['email'] = this.profileGroup.controls['email'].value
          //   data['profile_picture'] = this.imageName
          //   this._storage.set('userProfile' , data)
          // })
        }
      )
    // }

    
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
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

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 160,
      targetHeight: 160,
    };
  
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
  
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.imageProfile = this.pathForImage(newFileName)
      this.changeImage = true
      // this.presentToast(this.pathForImage(newFileName))
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
  
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  toggleEditMode() {
    if(this.editMode) {
      if(this.changeImage) this.uploadImage()
      else this.updateProfile()
    }
    this.editMode = !this.editMode 
  }

  public uploadImage() {
    // Destination URL
    var url = API_URL + 'authenticate/updateUser';
  
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
  
    // File name only
    var filename = this.lastImage;
  
    var options = {
      fileKey: "profile_picture",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
        firstname: this.profileGroup.controls['firstname'].value,
        surname: this.profileGroup.controls['surname'].value,
        sex: this.profileGroup.controls['sex'].value,
        phone_number: this.profileGroup.controls['phone_number'].value,
        email: this.profileGroup.controls['email'].value,
        user_id : this.userId
      }
    };
    // alert(JSON.stringify(options))
    //const fileTransfer = new Transfer();
  
    const fileTransfer: TransferObject = this.transfer.create();
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
  
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this._param.paramsData['firstname'] = this.profileGroup.controls['firstname'].value
      this._param.paramsData['surname'] = this.profileGroup.controls['surname'].value
      this._param.paramsData['sex'] = this.profileGroup.controls['sex'].value
      this._param.paramsData['phone_number'] = this.profileGroup.controls['phone_number'].value
      this._param.paramsData['email'] = this.profileGroup.controls['email'].value
      this._param.paramsData['profile_picture'] = this.imageName
      // this._storage.get('userProfile')
      // .then((data)=>{
      //   data['firstname'] = this.profileGroup.controls['firstname'].value
      //   data['surname'] = this.profileGroup.controls['surname'].value
      //   data['sex'] = this.profileGroup.controls['sex'].value
      //   data['phone_number'] = this.profileGroup.controls['phone_number'].value
      //   data['email'] = this.profileGroup.controls['email'].value
      //   data['profile_picture'] = targetPath
      //   this._storage.set('userProfile' , data)
      // })
      // alert(JSON.stringify(data))
      // this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
      // alert(JSON.stringify(err))
    });
  }

}
