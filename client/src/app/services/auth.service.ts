import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map} from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken;
  user;
  options;
  constructor(private http: Http) { }

  createAuthenticationHeaders(){
    this.loadToken();
    this.options = new RequestOptions({
      headers:new Headers({
        'Content-Type':'application/json',
        'authorization':this.authToken
      })
    })
  }

  loadToken(){
    this.authToken = localStorage.getItem('token');
  }

  registerUser(user) {
    return this.http.post('/api/auth/register', user).pipe(map(res => res.json()));
  }
  checkUsername(username) {

    return this.http.get('/api/auth/checkUsername/' + username).pipe(map(res => res.json()));
  }
  checkEMail(email) {
    return this.http.get('/api/auth/checkEmail/' + email).pipe(map(res => res.json()));
  }

  login(user){
    return this.http.post('/api/auth/login',user).pipe(map(res=>res.json()));
  }
  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  storeUserData(token, user){
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user
  }

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get('/api/auth/profile',this.options).pipe(map(res=>res.json()));
  }
  loggedIn() {
   return tokenNotExpired();
  }
}
