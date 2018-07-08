import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
//declare var UIkit: any;
export class DashboardComponent implements OnInit {

  articles;
  constructor(private blogService:BlogService, private authService:AuthService, private flashMessageService:FlashMessagesService) { 
    this.getArticleList();
  }

  ngOnInit() {
  }
  Ondelete(id, title)
  {
    if(confirm("Do you want to delete \'"+title+"\'?")) {
      this.blogService.deletearticle(id).subscribe(data=>{
        if(data.success)
        {
          this.flashMessageService.show(
            data.message,
            { cssClass: "alert-success animated slideInRight" }
          );
          this.getArticleList();
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
    console.log('Log anythong',id);
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
