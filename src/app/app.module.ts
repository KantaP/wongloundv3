import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http'
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
// import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MainPage } from '../pages/main/main';
import { LoginPage } from '../pages/login/login'
import { SignupPage } from '../pages/signup/signup'
import { CashoutPage } from '../pages/cashout/cashout'
import { SignupOwnerPage } from '../pages/signup-owner/signup-owner'
import { SignupTypePage } from '../pages/signup-type/signup-type'
import { FavouritePage } from '../pages/favourite/favourite'
import { SearchPage } from '../pages/search/search'
import { ReportPage } from '../pages/report/report'
import { Internal } from '../providers/internal'
import { External } from '../providers/external'
import { StorageSession } from '../providers/storage-session'
import { ProfilePage } from '../pages/profile/profile'
import { ShopProfilePage } from '../pages/shop-profile/shop-profile'
import { Paramservice} from '../providers/paramservice';
import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';
import { Transfer } from '@ionic-native/transfer'
import { FullimagePage } from '../pages/fullimage/fullimage'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
@NgModule({
  declarations: [
    MyApp,
    // AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    SignupPage,
    SignupTypePage,
    SignupOwnerPage,
    MainPage,
    ProfilePage,
    ShopProfilePage,
    FavouritePage,
    SearchPage,
    ReportPage,
    CashoutPage,
    FullimagePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp) ,
    ReactiveFormsModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    SignupPage,
    SignupTypePage,
    SignupOwnerPage,
    MainPage,
    ProfilePage,
    ShopProfilePage,
    FavouritePage,
    SearchPage,
    ReportPage,
    CashoutPage,
    FullimagePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler} , Internal , 
  External , StorageSession , Paramservice,Camera  ,Facebook , Geolocation , FilePath , File , 
  EmailComposer, Transfer , InAppBrowser , StatusBar , SplashScreen]
})
export class AppModule {}
