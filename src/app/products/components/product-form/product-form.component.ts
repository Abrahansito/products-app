import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input() product: any = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formData: any = {
    name: '',
    description: '',
    price: 0,
    category: ''
  };

  constructor(private productsService: ProductsService) {}

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
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Producto actualizado correctamente',
            showConfirmButton: false,
            timer: 2000
          });
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: err.error?.message || err.message || 'Ocurrió un error'
          });
        }
      });
    } else {
      this.productsService.createProduct(productData).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Producto creado correctamente',
            showConfirmButton: false,
            timer: 2000
          });
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error al crear',
            text: err.error?.message || err.message || 'Ocurrió un error'
          });
        }
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}
