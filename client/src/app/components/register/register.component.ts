import {  Component,  OnInit } from '@angular/core';
import {  FormBuilder,  FormGroup,  Validators} from '@angular/forms';
import {  AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.createForm()
  }

  ngOnInit() {}

  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
      cemail: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(35)])]
    }, {
      validator: this.matchingEmails('email', 'cemail')
    });
  }
  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.controls.username.value,
      email: this.form.controls.email.value,
      password: this.form.controls.password.value
    };
    this.authService.registerUser(user).subscribe(data => {
      console.log(data);
      if (!data.status) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(()=>{
          this.router.navigate(['/login']);
        },2000)
      }
    })
  }

  checkUsername(){
    const username = this.form.get('username').value;
    this.authService.checkUsername(username).subscribe(data=>{
      if(!data.success){
        this.usernameValid = false;
        this.usernameMessage = data.message;
      }
      else{
          this.usernameValid=true;
          this.usernameMessage = data.message;
      }
    })
  }
  checkEMail(){
    const email = this.form.get('email').value;
    this.authService.checkEMail(email).subscribe(data=>{
      if(!data.success){
        this.emailValid = false;
        this.emailMessage = data.message;
      }
      else{
          this.emailValid=true;
          this.emailMessage = data.message;
      }
    })
  }

  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['email'].enable();
    this.form.controls['cemail'].enable();
    this.form.controls['password'].enable();
  }
  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['email'].disable();
    this.form.controls['cemail'].disable();
    this.form.controls['password'].disable();
  }
  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value))
      return null;
    else
      return {
        'validateEmail': true
      };
  }
  matchingEmails(email, cemail) {
    return (group: FormGroup) => {
      if (group.controls[email].value === group.controls[cemail].value) {
        return null;
      }
      else {
        return {
          'matchingEmails': true
        };
      }

    };
  }
}
