import { Injectable } from '@angular/core';
// import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import * as Config from '../config';

@Injectable()
export class AuthenticationService {

  constructor(
    public storage: Storage,
    public http: Http
  ){}

  getUser(){
    return this.storage.get('User').then((val) => {
      if (val == null) {
        return false;
      } else {
        return val;
      }
    });
  }

  setUser(user){
    return this.storage.set('User', user);    
  }

  logOut(){
    return this.storage.clear();
  }

  doLogin(username, password){
    return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token',{
      username: username,
      password: password
    })
  }

  doRegister(user_data, token){
    let header = new Headers();
    header.append('Authorization','Bearer ' + token);
    return this.http.post(Config.WORDPRESS_REST_API_URL + 'users?token=' + token, user_data, {headers: header});
  }

  validateAuthToken(token){
    let header = new Headers();
    header.append('Authorization','Bearer ' + token);
    return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token/validate?token=' + token,
      {}, {headers: header})
  }
}
