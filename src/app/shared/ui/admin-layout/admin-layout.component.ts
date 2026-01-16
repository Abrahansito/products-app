import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    AvatarModule,
    MenuModule
  ],
  template: `
    <div class="layout-wrapper flex min-h-screen">

      <aside class="layout-sidebar text-white w-16rem flex-shrink-0 flex flex-column p-3"
       style="background-color: #0f172a;">

        <div class="mb-5 mt-2 text-center">
            <h2 class="m-0 text-white font-bold">Panel<br>Administrativo</h2>
        </div>

        <p-menu [model]="items" styleClass="w-full border-none bg-transparent p-0"></p-menu>
      </aside>

      <div class="layout-main flex-grow-1 flex flex-column bg-gray-50">

        <header class="h-4rem bg-white shadow-1 flex align-items-center justify-content-between px-4 z-1">
            <h3 class="m-0 text-gray-700 font-medium">Dashboard</h3>
            <div class="flex align-items-center gap-3">
                <span class="text-sm font-bold text-gray-600">Admin User</span>
                <p-avatar label="A" shape="circle" styleClass="bg-primary text-white cursor-pointer"></p-avatar>
                <p-button icon="pi pi-power-off" [rounded]="true" [text]="true" severity="danger"></p-button>
            </div>
        </header>

        <div class="p-4 flex-grow-1 overflow-auto">
            <router-outlet></router-outlet>
        </div>

      </div>
    </div>
  `,
})

export class AdminLayoutComponent {
  items: MenuItem[] = [
    {
        label: 'Gestión',
        items: [
            { label: 'Productos', icon: 'pi pi-box', routerLink: '/admin/products' },
            { label: 'Usuarios', icon: 'pi pi-users', routerLink: '/admin/users' }
        ]
    },
  ];
}
