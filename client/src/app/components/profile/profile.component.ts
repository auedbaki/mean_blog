import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private authService : AuthService) { }
  username;
  email;
  role;
  ngOnInit() {
    this.authService.getProfile().subscribe(profile=>{
      if(profile.success)
      {
        this.username = profile.user.username;
        this.email = profile.user.email;
        this.role = profile.user.role;
      }
      else
      {
        console.log(profile.message);
      }
   
    })
  }

}
