import { Component } from '@angular/core';
import { PostPage } from '../post/post';
import { PlacePage } from '../place/place';
import { LoginPage } from '../login/login';
import { NavController, LoadingController, NavParams, AlertController } from 'ionic-angular';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;

  userToken: string;

  categoryId: number;
  categoryTitle: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) { }

  ionViewWillEnter() {
    this.authenticationService.getUser()
      .then(
        data => {
          if (data != false) {
            this.loggedUser = true;
            this.userToken = data.token;
          }
          else
            this.loggedUser = false;
        },
        error => this.loggedUser = false
      );
    this.morePagesAvailable = true;

    //if we are browsing a category
    this.categoryId = this.navParams.get('id');
    this.categoryTitle = this.navParams.get('title');

    if (!(this.posts.length > 0)) {
      let loading = this.loadingCtrl.create();
      loading.present();

      this.wordpressService.getRecentPosts(this.categoryId)
        .subscribe(data => {
          for (let post of data) {
            post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
            this.posts.push(post);
          }
          loading.dismiss();
        });
    }
  }

  postTapped(event, post) {
    this.navCtrl.push(PostPage, {
      item: post
    });
  }

  checkToken() {
    console.log(this.userToken)
    this.authenticationService.validateAuthToken(this.userToken).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      });
  }

  doInfinite(infiniteScroll) {
    let page = (Math.ceil(this.posts.length / 10)) + 1;
    let loading = true;

    this.wordpressService.getRecentPosts(this.categoryId, page)
      .subscribe(data => {
        for (let post of data) {
          if (!loading) {
            infiniteScroll.complete();
          }
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          this.posts.push(post);
          loading = false;
        }
      }, err => {
        this.morePagesAvailable = false;
      })
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
