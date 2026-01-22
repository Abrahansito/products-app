import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //Verificar si está logueado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  //Verificar Roles (Si la ruta lo requiere)
  //Leemos la data que pondremos en app.routes.ts
  const requiredRole = route.data['role'];

  if (requiredRole) {
    const currentRole = authService.getRole(); //admin o user

    if (currentRole !== requiredRole) {
      //Si intenta entrar a Admin pero es User -> Lo mandamos al Home
      router.navigate(['/home']);
      return false;
    }
  }
  return true;
};
