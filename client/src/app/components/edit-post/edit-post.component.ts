import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import {AuthService} from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {  FormControl,  FormGroup,  FormBuilder,  Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  articleid;
  article;
  categories;
  form;
  loading=false;
  submitbtntxt = 'Save Changes';
  public options: Object = { 
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: true
  }
  
  constructor(private location:Location, private activatedRoute:ActivatedRoute,
     private blogService : BlogService, private flashMessageService:FlashMessagesService,
    private authService : AuthService, private formBuilder:FormBuilder,
  private router:Router) { 
    if (this.authService.checkRole() !== "admin") {
      this.flashMessageService.show(
        "You are not allowed to Create New Post.",
        { cssClass: "alert-warning animated slideInRight" }
      );
      this.router.navigate(["/"]);
    }
    this.blogService.getCategories().subscribe((data)=>{
      if(data.length > 0)
      {
        this.categories = data;
        console.log(this.categories);
      }
      else
      {
        this.flashMessageService.show(
          "Some Error Occured, Try Again Later!",
          { cssClass: "alert-danger animated slideInRight" }
        );
        this.router.navigate(["/"]);
      }
      
    })
    this.createNewBlogForm();
 
  }
 
  ngOnInit() {
    this.articleid = this.activatedRoute.snapshot.params;
    this.blogService.getArticleById(this.articleid.id).subscribe(data=>{
      if(data.success)
      {
        this.article = data.article;
        console.log(this.article.body);
        
      }
      else
      {
        this.flashMessageService.show(data.message,{cssClass:'alert alert-danger'});
        this.router.navigate(['/dashboard']);
      }
    });
  }
  onBlogUpdate()
  {
    this.loading = true;
    this.submitbtntxt = 'Saving Changes';
  }
  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.minLength(5),
          this.alphaNumericvaldation
        ])
      ],
      body: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(1000),
          Validators.minLength(10)
        ])
      ],
      description: ["", Validators.compose([Validators.required])],
      category: [""],
      status: [""],
      tags: [""]
    });
  }
  alphaNumericvaldation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { alphaNumericValidation: true };
    }
  }

  enableBlogForm()
  {
    this.form.get('title').enable();
    this.form.get("description").enable();
    this.form.get("body").enable();
    this.form.get("category").enable();
    this.form.get("status").enable();
  }
  disableBlogForm()
  {
    this.form.get('title').disable();
    this.form.get("description").disable();
    this.form.get("body").disable();
    this.form.get("category").disable();
    this.form.get("status").disable();
  }

  uploadBlogEdit()
  {

  }

  goBack()
  {
    this.location.back();
  }

}
