import { Component } from '@angular/core';
import { Platform, MenuController, AlertController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public authenticationService: AuthenticationService,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController
  ) {
    platform.ready().then(() => {
      authenticationService.getUser()
      .then(
        data => {
          if( data != false ) {
            authenticationService.validateAuthToken(data.token)
            .subscribe(
              res => this.rootPage = HomePage,
              err =>   this.rootPage = LoginPage
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

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  logOut(){
    this.authenticationService.logOut()
    .then(
      // res => this.navCtrl.push(LoginPage),
      res => this.showConfirm(),
      err => console.log('Error in log out')
    )
  }

  goToLogin(){
    // this.navCtrl.push(LoginPage);
    this.showConfirm()
  }

}

