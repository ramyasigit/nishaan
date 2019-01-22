import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { tokenNotExpired } from 'angular2-jwt';
@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  constructor(private http: Http) { }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'users/authenticate';
    return this.http.post(ep, user, { headers: headers })
      .map(res => res.json());
  }
  getAllUsers(){
    let ep = 'users/all';
    return this.http.get(ep)
      .map(res => res.json());
  }
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  getLoggedUserData() {
    this.loadUser();
    var user = {
      username: this.user.username
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'users/userIn';
    return this.http.post(ep, user, { headers: headers })
      .map(res => res.json());
  }

  loadUser() {
    const curUser = JSON.parse(localStorage.getItem('user'));
    this.user = curUser;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
  loggedIn() {
    return tokenNotExpired();
  }


  updateDevices(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'users/update';
    return this.http.put(ep, user, { headers: headers })
      .map(res => res.json());
  }
  updatePassword(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'users/updatePassword';
    return this.http.post(ep, user, { headers: headers })
      .map(res => res.json());
  }
  updateType(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'users/updateType';
    return this.http.put(ep, user, { headers: headers })
      .map(res => res.json());
  }
  addUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'users/register';
    return this.http.post(ep, user, { headers: headers })
      .map(res => res.json());
  }
  deleteUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'users/delete';
    return this.http.post(ep, user, { headers: headers })
      .map(res => res.json());
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
