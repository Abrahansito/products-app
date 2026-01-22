import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '..//auth';
import { finalize } from 'rxjs/operators';

import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { UiInputTextComponent } from '../../shared/ui/ui-input-text/ui-input-text.component';
import { UiInputPasswordComponent } from '../../shared/ui/ui-input-password/ui-input-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    MessageModule,
    UiButtonComponent,
    UiInputTextComponent,
    UiInputPasswordComponent
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  //Getters para el html
  get email(): FormControl { return this.form.get('email') as FormControl; }
  get password(): FormControl { return this.form.get('password') as FormControl; }

  login(event?: Event) {
    if (event) event.preventDefault();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Enviamos email, password
    this.authService.login(this.form.value)
      .pipe(finalize(() => {
        this.loading = false;
        this.cd.markForCheck();
      }))
      .subscribe({
        next: (res: any) => { // res trae la respuesta del backend
          
          const role = res.role || this.authService.getRole();

          if (role === 'admin') {
            this.router.navigate(['/admin/products']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Error login:', error);
          this.errorMessage = error.error?.message || 'Correo o contraseña incorrectos';
          this.cd.markForCheck();
        }
      });
  }
}
