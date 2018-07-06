import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  reloadClass;
  messageClass;
  message;
  loadingBlogs = false;
  form;
  articles;
  constructor(private formBuilder:FormBuilder,private blogService : BlogService) {
    
   }
 
  ngOnInit() {
    this.getArticles();
  }

  async getArticles(){
    await this.blogService.getArticle().subscribe(data=>{
      if(data.success)
      {
        this.articles = data.articles;
        this.loadingBlogs = false;
        this.reloadClass = undefined;
        console.log(this.articles);
      }
      else{

      }
    })
  }

  draftComment()
  {
    
  }
  reloadBlogs()
  {
    this.loadingBlogs = true;
    this.reloadClass = "fa-spin";
    this.getArticles();    
   
    
  }
}
