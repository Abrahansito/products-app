import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<p-toast></p-toast><p-confirmDialog></p-confirmDialog><router-outlet></router-outlet>',
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule]
})
export class App {
  protected readonly title = signal('products-app');
}
