import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  // },
  {
    path: 'products',
    loadComponent: () => import('./products/pages/products-list/products-list').then(m => m.ProductsListComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
