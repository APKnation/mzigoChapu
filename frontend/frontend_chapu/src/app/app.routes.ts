import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Cargo } from './components/cargo/cargo';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cargo', component: Cargo },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' }
];