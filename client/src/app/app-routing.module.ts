import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { BlogComponent } from './components/blog/blog.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { ArticleComponent } from './components/article/article.component';
import { AuthGuard  } from './guards/auth.guard';
import { NotAuthGuard  } from './guards/notAuth.guard';

const appRoutes:Routes=[
    {path:'',component:HomeComponent},
    {path:'blog', component:BlogComponent},
    {path:'dashboard',component:DashboardComponent, canActivate:[AuthGuard]},
    {path:'register',component:RegisterComponent, canActivate:[NotAuthGuard]},
    {path:'login',component:LoginComponent, canActivate:[NotAuthGuard]},
    {path:'profile',component:ProfileComponent, canActivate:[AuthGuard]},
    {path:'newpost', component: NewPostComponent, canActivate:[AuthGuard]},
    {path:'editpost/:id', component:EditPostComponent, canActivate:[AuthGuard]},
    {path:'user/:username',component:HomeComponent},
    {path:'blog/article/:articleid',component:ArticleComponent},
    {path:'blog/category/:categoryid',component:HomeComponent},
    {path:'**',component:HomeComponent}
]

@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports:[RouterModule]
})
export class AppRoutingModule { }
