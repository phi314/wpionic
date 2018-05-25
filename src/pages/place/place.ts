import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthenticationService } from '../../services/authentication.service';
import { WordpressService } from '../../services/wordpress.service';

/**
 * Generated class for the PlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  places: Array<any> = new Array<any>();

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authenticationService: AuthenticationService,
    public wordpressService: WordpressService,
    public alertCtrl: AlertController
  ) 
  {}

  ionViewDidLoad() {
    if (!(this.places.length > 0)) {
    let loading = this.loadingCtrl.create();
      loading.present();

      this.wordpressService.getPlaces()
        .subscribe(data => {
          let placeCategories = [];
          for (let place of data) {
            this.places.push(place);
          }
          loading.dismiss();
        });
    }
  }

  logOut() {
    this.authenticationService.logOut()
      .then(
        res => {
          let confirm = this.alertCtrl.create({
            title: 'Use this lightsaber?',
            message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                  console.log('Disagree clicked');
                }
              },
              {
                text: 'Logout',
                handler: () => {
                  this.navCtrl.push(LoginPage);
                }
              }
            ]
          });
          confirm.present();
        },
        err => console.log('Error in log out')
      )
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

}
