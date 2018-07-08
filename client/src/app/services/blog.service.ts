import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: "root"
})
export class BlogService {
  options;
  constructor(private http: Http, private authService: AuthService) {
    this.createAuthenticationHeaders();
  }
  createAuthenticationHeaders() {
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
  }

  createAuthenticationToken()
  {
    return this.authService.getAuthenticationToken();
  }

  createFormAuthenticationToken()
  {
    return this.authService.getFormAuthenticationToken();
  }
  
  getCategories() {
    return this.http
      .get("https://auedbaki.xyz/api/app/categories", this.options)
      .pipe(map(res => res.json()));
  }
  submitArticle( data){
    return this.http
      .post('/api/blog/newBlog',data, this.createFormAuthenticationToken())
      .pipe(map(res=>res.json()));
  }

  getArticle(){
    return this.http
      .get('/api/blog/articles/',this.options)
      .pipe(map(res=>res.json()));
  }
  getArticleById(id){
    return this.http 
      .get('/api/blog/id/'+id,this.options)
      .pipe(map(res=>res.json()));
  }
  getArticleByAuthor(authorname)
  {
    return this.http
      .get('/api/blog/author/'+authorname,this.options)
      .pipe(map(res=>res.json()));
  }
  puteditarticle(id,content)
  {
    return this.http
      .put('/api/blog/edit/'+id,content,this.createAuthenticationToken())
      .pipe(map(res=>res.json()));
  }
  edletearticle(id)
  {
    return this.http
      .delete('/api/blog/delete/'+id,this.createAuthenticationToken())
      .pipe(map(res=>res.json()));
  }

  likearticle(id)
  {
    return this.http
      .put('/api/blog/like/'+id,this.createAuthenticationToken())
      .pipe(map(res=>res.json()));
  }

  dislikearticle(id)
  {
    return this.http
      .put('/api/blog/dislike/'+id,this.createAuthenticationToken())
      .pipe(map(res=>res.json()));
  }
  deletearticle(id)
  {
    return this.http
      .delete('/api/blog/delete/'+id,this.createAuthenticationToken())
      .pipe(map(res=>res.json()));
  }
}
