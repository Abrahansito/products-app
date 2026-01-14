import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth';
import { finalize } from 'rxjs/operators';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ChangeDetectorRef } from '@angular/core';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { UiInputTextComponent } from '../../shared/ui/ui-input-text/ui-input-text.component';
import { FormControl } from '@angular/forms';
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
  styleUrl: './login.css'
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMessage = ''; // Aquí guardaremos el texto del error

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getters para los controles del formulario
  get username(): FormControl { return this.form.get('username') as FormControl; }
  get password(): FormControl { return this.form.get('password') as FormControl; }

  login(event?: Event) {
    if (event) event.preventDefault();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = ''; // Limpiamos errores previos al intentar de nuevo

    this.authService.login(this.form.value)
      .pipe(finalize(() => {
        this.loading = false;
        this.cd.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error login:', error);
          // Guardamos el mensaje para mostrarlo en el HTML
          this.errorMessage = error.error?.message || 'Credenciales incorrectas';
          this.cd.markForCheck();
        }
      });
  }
}
