import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-ui-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule],
  template: `
    <div class="field mb-4">
      <label *ngIf="label" class="font-bold block mb-2">{{ label }}</label>

      <input
        pInputText
        [type]="type"
        [placeholder]="placeholder"
        [formControl]="control"
        class="w-full"
        [class.ng-dirty]="control.invalid && control.touched"
      />

      <small *ngIf="control.invalid && control.touched" class="p-error block mt-1">
        {{ getErrorMessage() }}
      </small>
    </div>
  `
})
export class UiInputTextComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: FormControl; // Recibimos el control del padre

  getErrorMessage(): string {
    if (this.control.hasError('required')) return 'Este campo es requerido.';
    if (this.control.hasError('minlength')) {
      const min = this.control.errors?.['minlength'].requiredLength;
      return `Mínimo ${min} caracteres.`;
    }
    if (this.control.hasError('email')) return 'Correo electrónico inválido.';
    return 'Campo inválido.';
  }
}
