import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-ui-input-number',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputNumberModule],
  template: `
    <div class="field mb-4">
      <label *ngIf="label" class="font-bold block mb-2">{{ label }}</label>

      <p-inputNumber
        [formControl]="control"
        [mode]="mode"
        [currency]="currency"
        [locale]="locale"
        [minFractionDigits]="2"
        placeholder="0.00"
        styleClass="w-full"
        class="w-full"
        [class.ng-dirty]="control.invalid && control.touched">
      </p-inputNumber>

      <small *ngIf="control.invalid && control.touched" class="p-error block mt-1">
        Este campo es requerido.
      </small>
    </div>
  `
})
export class UiInputNumberComponent {
  @Input() label: string = '';
  @Input() control!: FormControl;
  @Input() mode: 'decimal' | 'currency' = 'decimal'; // Para elegir si es dinero o número simple
  @Input() currency: string = 'USD'; // PEN o USD
  @Input() locale: string = 'en-US'; // es-PE para Perú
}
