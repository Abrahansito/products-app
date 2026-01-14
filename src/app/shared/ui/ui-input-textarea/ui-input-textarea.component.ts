import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-ui-input-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextareaModule],
  template: `
    <div class="field mb-4">
      <label *ngIf="label" class="font-bold block mb-2">{{ label }}</label>

      <textarea
        rows="5"
        cols="30"
        pTextarea
        [autoResize]="true"
        [formControl]="control"
        class="w-full"
        [class.ng-dirty]="control.invalid && control.touched">
      </textarea>

      <small *ngIf="control.invalid && control.touched" class="p-error block mt-1">
        Este campo es requerido.
      </small>
    </div>
  `
})
export class UiInputTextareaComponent {
  @Input() label: string = '';
  @Input() control!: FormControl;
}
