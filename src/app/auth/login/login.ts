import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  login(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    console.log('Login iniciado');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);

    if (this.form.invalid) {
      console.log('Formulario inválido');
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    console.log('Enviando petición:', this.form.value);

    this.authService.login(this.form.value)
      .pipe(finalize(() => {
        this.loading = false;
        if (!this.authService.isLoggedIn()) {
          this.errorMessage = 'Error: no se recibió o guardó el token desde el servidor.';
          console.error('Token no guardado en localStorage');
        }
      }))
      .subscribe({
        next: (response) => {
          console.log('Respuesta exitosa en componente:', response);
          if (this.authService.isLoggedIn()) {
            this.router.navigate(['/products']);
          } else {
            console.warn('No se navegó: token no presente tras login');
          }
        },
        error: (error) => {
          console.error('Error en componente:', error);
          this.errorMessage = error.error?.message || 'Usuario o contraseña incorrectos';
        }
      });
  }
}
