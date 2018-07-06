import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  articles;
  constructor(private blogService:BlogService, private authService:AuthService, private flashMessageService:FlashMessagesService) { 
    this.getArticleList();
  }

  ngOnInit() {
  }

  getArticleList()
  {
    this.blogService.getArticleByAuthor(this.authService.getUserName()).subscribe(data=>{
      if(data.success)
      {
        this.articles = data.articles;
        
      }
      else
      {
        this.flashMessageService.show(
          data.message,
          { cssClass: "alert-danger animated slideInRight" }
        );
        
      }
    })
  }
}
