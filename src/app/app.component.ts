import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
// import { StatusBar, Splashscreen } from 'ionic-native';
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { MainPage } from '../pages/main/main';
// import { LoginPage } from '../pages/login/login';
// import { TabsPage } from '../pages/tabs/tabs'
// import { ShopProfilePage} from '../pages/shop-profile/shop-profile'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = MainPage;

  constructor(public platform: Platform , public statusBar: StatusBar , public splashScreen: SplashScreen)  {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // let status bar overlay webview
      statusBar.overlaysWebView(true);

      // set status bar to white
      statusBar.backgroundColorByHexString('#000');
      splashScreen.hide();
    });
  }
}
