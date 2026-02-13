import { Routes } from '@angular/router';
import { ProfileComponent } from '../Components/profile/profile.component';
import { NotFoundComponent } from '../Components/not-found/not-found.component';
import { HomeComponent } from '../Components/home/home.component';
import { LoginComponent } from '../Components/login/login.component';
import { RegisterComponent } from '../Components/register/register.component';
import { UploadComponent } from '../Components/upload/upload.component';
import { authGuard } from '../Services/auth.guard';
import { PostDetailComponent } from '../Components/post-detail/post-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home Page'
    },
    {   
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile Page'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Sign-up'
    },
    {
        path: 'upload',
        component: UploadComponent,
        title: 'Upload',
        canActivate: [authGuard] //<-- tipo un middleware
    },
    { 
        path: 'post/:id', 
        component: PostDetailComponent 
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: "404: Not Found"
    }
];
