import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  admin;
  modalForm: FormGroup;
  constructor(public authService : AuthService, private router:Router, private flashMessagesService:FlashMessagesService,private fb: FormBuilder) { 
    this.createModel();
  }

  ngOnInit() {
    if(this.authService.checkRole()==='admin')
      this.admin=true;
    else
      this.admin=false;
  }
  onLogoutClick(){
    this.authService.logout();
    this.flashMessagesService.show('You are logged out',{cssClass:'alert-info'})
    this.router.navigate(['/']);
    
  }
  createModel()
  {
    this.modalForm = this.fb.group({
      modalFormNameEx: ['', Validators.required],
      modalFormEmailEx: ['', [Validators.email, Validators.required]],
      modalFormSubjectEx: ['', Validators.required],
      modalFormTextEx: ['', Validators.required]
    });
  }
  onModelSubmit(){
    
  }

}
