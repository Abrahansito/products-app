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
    path: 'admin',
    loadComponent: () => import('./shared/ui/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'products',
        loadComponent: () => import('./products/pages/products-list/products-list').then(m => m.ProductsListComponent)
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
