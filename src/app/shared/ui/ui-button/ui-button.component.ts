import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <p-button
      [label]="label"
      [icon]="icon"
      [loading]="loading"
      [disabled]="disabled"
      [styleClass]="getStyleClass()"
      (onClick)="handleClick()"
      class="w-full">
    </p-button>
  `
})
export class UiButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;

// Define los tipos de variantes disponibles
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'outline' = 'primary';

  @Output() onClick = new EventEmitter<void>();

  getStyleClass(): string {
    const base = 'w-full '; // Clase base para ancho completo

    switch (this.variant) {
      case 'primary':
        return base + 'p-button-success'; // Verde actual
      case 'danger':
        return base + 'p-button-danger';
      case 'secondary':
        return base + 'p-button-secondary';
      case 'outline':
        return base + 'p-button-outlined';
      default:
        return base + 'p-button-primary';
    }
  }

  handleClick() {
    if (!this.disabled && !this.loading) {
      this.onClick.emit();
    }
  }
}
