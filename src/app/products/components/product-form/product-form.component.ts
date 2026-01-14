import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, TextareaModule, ButtonModule, ToastModule, DialogModule,],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input() product: any = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  // Controla la visibilidad del diálogo
  visible: boolean = true;

  formData: any = {
    name: '',
    description: '',
    price: 0,
    category: ''
  };

  constructor(private productsService: ProductsService, private messageService: MessageService) {}

  ngOnInit() {
    if (this.product) {
      this.formData = { ...this.product };
    }
  }

  onSubmit() {
    const productData = {
      name: this.formData.name,
      description: this.formData.description,
      price: Number(this.formData.price) || 0,
      category: this.formData.category
    };

    if (this.product?.id) {
       const productId = Number(String(this.product.id).split(':')[0]);

      this.productsService.updateProduct(productId, productData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Producto actualizado' });
          this.visible = false; // Cerramos el diálogo visualmente
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
        }
      });
    } else {
      this.productsService.createProduct(productData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Producto creado' });
          this.visible = false;
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear' });
        }
      });
    }
  }

  // Función para cerrar correctamente
  closeDialog() {
    this.visible = false;
    this.cancelled.emit();
  }
}
