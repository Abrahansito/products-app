import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-ui-input-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule],
  template: `
    <div class="field mb-4">
      <label *ngIf="label" class="font-bold block mb-2">{{ label }}</label>

      <p-password
        [formControl]="control"
        [toggleMask]="true"
        [feedback]="false"
        [placeholder]="placeholder"
        styleClass="w-full"
        inputStyleClass="w-full"
        [class.ng-dirty]="control.invalid && control.touched">
      </p-password>

      <small *ngIf="control.invalid && control.touched" class="p-error block mt-1">
        {{ getErrorMessage() }}
      </small>
    </div>
  `
})
export class UiInputPasswordComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '******';
  @Input() control!: FormControl;

  getErrorMessage(): string {
    if (this.control.hasError('required')) return 'La contraseña es obligatoria.';
    if (this.control.hasError('minlength')) return `Mínimo ${this.control.errors?.['minlength'].requiredLength} caracteres.`;
    return 'Campo inválido.';
  }
}
