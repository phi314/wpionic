import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { PlacePage } from '../pages/place/place';
import { LoginPage } from '../pages/login/login';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  private placePage;
  private homePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    authenticationService: AuthenticationService,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController
  ) {

    this.placePage = PlacePage;
    this.homePage = HomePage;

    platform.ready().then(() => {
      authenticationService.getUser()
        .then(
          data => {
            if (data != false) {
              authenticationService.validateAuthToken(data.token)
                .subscribe(
                  res => this.rootPage = HomePage,
                  err => this.rootPage = LoginPage
                )
            }
            else this.rootPage = LoginPage
          },
          err => this.rootPage = LoginPage
        );
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    this.rootPage = page;
    this.menuCtrl.close();
  }
}

