import { Routes } from '@angular/router';
import { ProfileComponent } from '../Components/profile/profile.component';
import { NotFoundComponent } from '../Components/not-found/not-found.component';
import { HomeComponent } from '../Components/home/home.component';
import { LoginComponent } from '../Components/login/login.component';
import { RegisterComponent } from '../Components/register/register.component';

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
        path: '**',
        component: NotFoundComponent,
        title: "404: Not Found"
    }
];
