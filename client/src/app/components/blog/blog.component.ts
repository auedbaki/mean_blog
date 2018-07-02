import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  reloadClass;
  messageClass;
  message;
  newPost = false;
  loadingBlogs = false;
  form;
  constructor(private formBuilder:FormBuilder) { }
 
  ngOnInit() {
  }
  createNewBlogForm(){
    this.form = this.formBuilder.group({
       title:['',Validators.compose([
         Validators.required,
         Validators.maxLength(100),
         Validators.minLength(5)
       ])]
    })
  }
  alphaNumericvaldation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value))
    {
      return null;
    }
    else{
      return {'alphaNumericValidation':true}
    }
  }
  newBlogForm() {
    this.newPost = true;
  }
  draftComment()
  {
    
  }
  reloadBlogs()
  {
    this.loadingBlogs = true;
    this.reloadClass = "fa-spin";
    setTimeout(() => {
      this.loadingBlogs = false;
      this.reloadClass = undefined;
    }, 4000);
  }
}
