import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form;
  previousUrl;
  icontype;
  constructor( private formBuilder: FormBuilder, private authService:AuthService,  private router:Router, private authGuard : AuthGuard) { this.createForm(); }

  ngOnInit() {
    if(this.authGuard.redirectUrl)
    {
      this.icontype = 'user';
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be loggedin to view the requested page.';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
  }
  // Function to disable form
  disableForm() {
    this.form.controls['username'].disable(); // Disable username field
    this.form.controls['password'].disable(); // Disable password field
  }

  // Function to enable form
  enableForm() {
    this.form.controls['username'].enable(); // Enable username field
    this.form.controls['password'].enable(); // Enable password field
  }

  // Functiont to submit form and login user
  onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }

    this.authService.login(user).subscribe(data=>{
      if(!data.success){
        this.icontype = 'times';
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      }else{
        this.icontype = 'check';
        this.messageClass = 'alert alert-success';
        this.message = 'Login '+data.message;
        this.authService.storeUserData(data.token);
        
        setTimeout(()=>{
          if(this.previousUrl)
          {
            this.router.navigate([this.previousUrl]);
          }
          else{
            this.router.navigate(['/profile']);
          }
        },2000);
      }
    })
  }
} 