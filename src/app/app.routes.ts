import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  //Redirección inicial
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  //Rutas Login y Registro
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  //RUTA USUARIO NORMAL
  //Solo requiere estar logueado (authGuard), no pide rol específico
  {
    path: 'home',
    loadComponent: () => import('./Home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },

  //Ruta del adminitrador protegida por el rol
  {
    path: 'admin',
    loadComponent: () => import('./shared/ui/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    data: { role: 'admin' },
    children: [
      {
        path: 'products',
        loadComponent: () => import('./products/pages/products-list/products-list').then(m => m.ProductsListComponent)
      },
      //Nueva ruta para ver usuarios
      {
        path: 'users',
        loadComponent: () => import('./users/pages/users-list/users-list.component').then(m => m.UsersListComponent)
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      }
    ]
  },

  //Cualquier ruta desconocida va al login
  {
    path: '**',
    redirectTo: '/login'
  }
];
