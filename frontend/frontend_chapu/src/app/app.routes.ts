import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Cargo } from './components/cargo/cargo';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cargo', component: Cargo },
  { path: '**', redirectTo: '' } // Redirect all unknown paths to home
];