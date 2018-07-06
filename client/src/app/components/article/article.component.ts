import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Location } from '@angular/common';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  article;
  constructor(private blogService : BlogService, private router:Router, private location:Location,
     private flashMessageService:FlashMessagesService, private activatedRoute:ActivatedRoute) { 


  }

  ngOnInit() {
      this.blogService.getArticleById(this.activatedRoute.snapshot.params.articleid).subscribe(data=>{
        if(data.success)
        {
          this.article = data.article;
        }
        else
        {
          if(data.message.message)
          this.flashMessageService.show(data.message.message,{cssClass:'alert alert-danger'});
          else
          this.flashMessageService.show(data.message,{cssClass:'alert alert-danger'});
          this.location.back();
        }
      })
  }

}
