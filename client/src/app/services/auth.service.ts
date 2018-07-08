import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken;
  user;
  options;
  decodedToken
  constructor(private http: Http) { }

  createAuthenticationHeaders(){
    this.loadToken();
    this.options = new RequestOptions({
      headers:new Headers({
        'Content-Type':'application/json',
        'authorization':'Bearer '+this.authToken
      })
    })
  }
  getAuthenticationToken()
  {
    this.createAuthenticationHeaders();
    return this.options;
  }
  getFormAuthenticationToken()
  {
    this.loadToken();
    return new RequestOptions({
      headers:new Headers({
        'enctype':'multipart/form-data',
        'authorization':'Bearer '+this.authToken
      })
    })
  }
  loadToken(){
    this.authToken = localStorage.getItem('token');
    this.decodedToken = helper.decodeToken(this.authToken);
    // this.userrole = this.jwtHelper.decodeToken(this.authToken);
  }
  checkRole(){
    this.loadToken();
    return this.decodedToken.role;
  }
  getUserId() {
    this.loadToken();
    return this.decodedToken.userId;
  }
  getUserName()
  {
    this.loadToken();
    return this.decodedToken.username;
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
  storeUserData(token){
    localStorage.setItem('token',token);
    this.authToken = token;
  }

  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get('/api/auth/profile',this.options).pipe(map(res=>res.json()));
  }
  loggedIn() {
    this.loadToken();
   if(helper.isTokenExpired(this.authToken))
   {
     return false;
   }
   else
   {
     return true;
   }
  }
}
