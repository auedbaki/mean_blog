import { Component, OnInit } from '@angular/core';
import {  FormControl,  FormGroup,  FormBuilder,  Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { BlogService } from '../../services/blog.service';


@Component({
  selector: "app-new-post",
  templateUrl: "./new-post.component.html",
  styleUrls: ["./new-post.component.css"]
})
export class NewPostComponent implements OnInit {
  messageClass;
  message;
  submitbtntxt = "Submit";
  loading;
  categories;
  selectedThumbnail:File;
  form;
  postData:FormData=new FormData();
  

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService : BlogService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) {
    if (this.authService.checkRole() !== "admin") {
      this.flashMessagesService.show(
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
        this.flashMessagesService.show(
          "Some Error Occured, Try Again Later!",
          { cssClass: "alert-danger animated slideInRight" }
        );
        this.router.navigate(["/"]);
      }
      
    })
    this.createNewBlogForm();
  
  }

  ngOnInit() {
   
  }
  UploadThumbnail(event)
  {
    this.selectedThumbnail = event.target.files[0];
    const random = Math.round((new Date()).getTime() / 1000);
    this.postData.append('thumbnail',this.selectedThumbnail, this.selectedThumbnail.name);
    console.log(this.selectedThumbnail);
  }
  
  onBlogSubmit() {
    this.loading = true;
    this.submitbtntxt = "Submitting";
    this.disableBlogForm();
    // const blog = {
    //   title: this.form.controls.title.value,
    //   description: this.form.controls.description.value,
    //   body: this.form.controls.body.value,
    //   url: this.form.controls.url.value,
    //   category: this.form.controls.category.value,
    //   status: this.form.controls.status.value,
    //   tags: this.form.controls.tags.value,
    //   createdBy: this.authService.getUserId()
    // };
    this.postData.append('title',this.form.controls.title.value);
    this.postData.append('description',this.form.controls.description.value);
    this.postData.append('body',this.form.controls.body.value);
    this.postData.append('url',this.form.controls.url.value);
    this.postData.append('category',this.form.controls.category.value);
    this.postData.append('status',this.form.controls.status.value);
    this.postData.append('tags',this.form.controls.tags.value);
    this.postData.append('createdBy',this.authService.getUserId());
    // console.log(this.postData);
   this.blogService.submitArticle(this.postData).subscribe(data=>{
      this.loading = false;
      if(data.success)
      {
        
        this.submitbtntxt = "Submitted";
        this.flashMessagesService.show(
          "Article Submitted Successfully",
          { cssClass: "alert-success animated slideInRight" }
        );
        this.router.navigate(["/dashboard"]);
      }
      else
      {
        this.submitbtntxt = "Try Again";
        this.flashMessagesService.show(
          data.message,
          { cssClass: "alert-danger animated slideInRight" }
        );
      }
      this.enableBlogForm();
    })
     
      
 

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
      url: [""],
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
    this.form.get("url").enable();
    this.form.get("category").enable();
    this.form.get("status").enable();
  }
  disableBlogForm()
  {
    this.form.get('title').disable();
    this.form.get("description").disable();
    this.form.get("body").disable();
    this.form.get("url").disable();
    this.form.get("category").disable();
    this.form.get("status").disable();
  }

}
