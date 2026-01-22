import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
//Importamos FormControl para los getters
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '..//auth';
import { MessageService } from 'primeng/api';
//Importamos el validador personalizado
import { passwordMatchValidator } from '../../auth/register/password-match.validator';

import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
//Importamos los componenetes
import { UiInputTextComponent } from '../../shared/ui/ui-input-text/ui-input-text.component';
import { UiInputPasswordComponent } from '../../shared/ui/ui-input-password/ui-input-password.component';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ToastModule,
    UiInputTextComponent,
    UiInputPasswordComponent,
    UiButtonComponent
],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  loading = false;

  // Definición del Formulario
  form = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    //Aplicamos el validador personalizado
    validators: passwordMatchValidator
  });

  //Getters para facilitar el acceso en el HTML
  get full_name() { return this.form.get('full_name') as FormControl; }
  get email() { return this.form.get('email') as FormControl; }
  get password() { return this.form.get('password') as FormControl; }
  get confirmPassword() { return this.form.get('confirmPassword') as FormControl; }

  register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    //Obtenemos los valores
    const val = this.form.getRawValue();

    //Al enviarlos, agregamos "|| ''" para asegurar que nunca sean null
    this.authService.register({
      full_name: val.full_name || '',
      email: val.email || '',
      password: val.password || ''
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Cuenta Creada', detail: 'Redirigiendo al login...' });
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'Ocurrió un error al registrarse';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      }
    });
  }
}
