import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  template: `
    <div class="flex flex-column align-items-center justify-content-center min-h-screen bg-gray-50">
      <p-card [style]="{ width: '90%', maxWidth: '600px' }" styleClass="text-center shadow-4">
        <div class="mb-4">
            <i class="pi pi-user text-6xl text-primary"></i>
        </div>
        <h1 class="text-900 font-bold text-4xl mb-2">¡Bienvenido a la Tienda!</h1>
        <p class="text-gray-600 text-xl mb-5">Has iniciado sesión correctamente como Cliente.</p>
        <div class="flex justify-content-center gap-3">
            <p-button label="Ver Catálogo" icon="pi pi-shopping-bag"></p-button>

            <p-button label="Cerrar Sesión" icon="pi pi-power-off" severity="secondary" (onClick)="logout()"></p-button>
        </div>
      </p-card>
    </div>
  `
})
export class HomeComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
