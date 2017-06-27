import { Injectable } from '@angular/core';
import { Http , Headers  } from '@angular/http';
import 'rxjs/add/operator/map';

import { RegisterUser , RegisterOwner , Login , UpdateUser , ShopRecommended , UpdateOwner , ShopPromotion} from '../models/request';
import { API_URL } from './settings'
import { Paramservice } from './paramservice'
/*
  Generated class for the External provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class External {

  constructor(public http: Http , public _param: Paramservice) {
    console.log('Hello External Provider');
  }

  registerUser(registerRequest:RegisterUser) {
    var body = JSON.stringify(registerRequest)
    var headers = new Headers({ 'Content-Type': 'application/json' })
    return this.http.post(API_URL + 'authenticate/signUp' , body , {headers : headers})
  }

  registerOwner(registerRequest: RegisterOwner) {
    var body = JSON.stringify(registerRequest)
    var headers = new Headers({ 'Content-Type': 'application/json' })
    return this.http.post(API_URL + 'authenticate/signUp' , body , {headers : headers})
  }

  findProvince() {
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.get(API_URL + 'etc/findProvince' , { headers: headers})
  }

  login(loginRequest: Login) {
    var body = JSON.stringify(loginRequest)
    var headers = new Headers({ 'Content-Type': 'application/json' })
    return this.http.post(API_URL + 'authenticate/signIn' , body , {headers : headers})
  }

  updateProfile(updateRequest:UpdateUser ) {
    var body = JSON.stringify(updateRequest)
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'authenticate/updateUser' , body , { headers: headers})
  }

  updateShopRecommended(shopRecommendedRequest: ShopRecommended) {
    var body = JSON.stringify(shopRecommendedRequest)
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'authenticate/updateShop' , body , { headers: headers})
  }

  updateShopProfile(shopProfile:UpdateOwner) {
    var body = JSON.stringify(shopProfile)
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'authenticate/updateShop' , body , { headers: headers})
  }

  findPromotion(pro_id) {
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.get(API_URL + 'shop/findPromotion/' + pro_id , { headers: headers})
  } 

  findPromotionByShop(shop_id) {
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.get(API_URL + 'shop/findPromotionByShop/' + shop_id , { headers: headers})
  } 

  findPromotionByShopAll(shop_id) {
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.get(API_URL + 'shop/findPromotionByShopAll/' + shop_id , { headers: headers})
  }

  createShopPromotion(shopPromotion: ShopPromotion) {
    var body = JSON.stringify(shopPromotion)
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/createPromotion' , body , { headers: headers})
  }

  updateShopPromotion(shopPromotion: ShopPromotion) {
    var body = JSON.stringify(shopPromotion)
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/updatePromotion' , body , { headers: headers})
  }

  getFeaturesShop(province) {
    
    var body = JSON.stringify({province: province})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'etc/getFeaturesShop', body , { headers: headers})
  }

  getRecommendedShop(province) {
    var body = JSON.stringify({province: province})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'etc/getRecommendedShop' , body , { headers: headers})
  }

  getShopProfile(shopId: number) {
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.get(API_URL + 'shop/getProfile/'+shopId , { headers: headers})
  }

  getShopByType(type: number , province) {
    var body = JSON.stringify({province: province , type: type})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/getShopByType' , body , { headers: headers})
  }

  getShopFeatureByType(type: number , province) {
    var body = JSON.stringify({province: province , type: type})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/getShopFeatureByType' , body , { headers: headers})
  }

  setFavouriteShop(user_id:number , shop_id: number ) {
    var body = JSON.stringify({user_id: user_id , shop_id: shop_id})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'etc/setFavouriteShop' , body , { headers: headers})
  }

  unsetFavouriteShop(user_id:number , shop_id: number ) {
    var body = JSON.stringify({user_id: user_id , shop_id: shop_id})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'etc/unsetFavouriteShop' , body , { headers: headers})
  }

  checkFavourite(user_id:number , shop_id: number ) {
    var body = JSON.stringify({user_id: user_id , shop_id: shop_id})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'etc/checkFavourite' , body , { headers: headers})
  }

  getAllFavourite(user_id:number) {
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.get(API_URL + 'etc/getAllFavourite/'+user_id , { headers: headers})
  }

  searchShop(keyword: string , province: string) {
    var body = JSON.stringify({keyword: keyword, province: province})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/searchShop' , body , { headers: headers})
  }

  setActivity(user_id:number , shop_id:number) {
    var body = JSON.stringify({user_id: user_id , shop_id: shop_id})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/setActivity' , body , { headers: headers})
  }

  checkActivity(user_id:number , shop_id:number) {
    var body = JSON.stringify({user_id: user_id , shop_id: shop_id})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/checkActivity' , body , { headers: headers})
  }

  unsetActivity(user_id:number , shop_id: number ) {
    var body = JSON.stringify({user_id: user_id , shop_id: shop_id})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/unsetActivity' , body , { headers: headers})
  }

  getLucky(province: string) {
    var body = JSON.stringify({province: province})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'etc/getLucky' , body ,{ headers: headers})
  }

  incrementCountView(shop_id: number) {
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.get(API_URL + 'etc/incrementCountView/'+shop_id , { headers: headers})
  }

  searchAddressByLatlng(latlng) {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&key=AIzaSyAnFmUDK-M8gfESjHSy7K_SvDj1KEtKK4U')
  } 

  getNormalShop(province:string , type:number = 0) {
    var body = JSON.stringify({province: province , type: type})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/getNormalShop' , body , { headers: headers})
  }

  checkInvoiceStatus(invoice_id: string) {
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.get(API_URL + 'etc/checkInvoice/'+invoice_id , { headers: headers})
  }

  changePassword(changeRequest: any) {
    var body = JSON.stringify(changeRequest)
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'etc/changePassword' , body , { headers: headers})
  }

  activityShops(province: string) {
    var body = JSON.stringify({province: province })
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'etc/activityShops' ,body,{ headers: headers})
  }

  getluckyToday(province: string) {
    var body = JSON.stringify({province: province })
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/getLuckyShop' ,body ,{ headers: headers})
  }

  deletePromotion(proId: any, shopId: any) {
    var body = JSON.stringify({proId: proId, shopId: shopId})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'shop/deletePromotion' ,body ,{ headers: headers})
  }

  loadImage(image: string) {
    return API_URL + 'images/'+ image
  }

  getUserProfile(userId: any) {
    var body = JSON.stringify({userId:userId})
    var headers = new Headers({'Content-type': 'application/json'})
    return this.http.post(API_URL + 'authenticate/getUserProfile' ,body ,{ headers: headers})
  }

}
