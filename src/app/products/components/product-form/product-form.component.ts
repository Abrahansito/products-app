import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';

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
  // Convertir precio a número
  const productData = {
    name: this.formData.name,
    description: this.formData.description,
    price: Number(this.formData.price) || 0,
    category: this.formData.category
  };

  if (this.product?.id) {
    // Asegurar que el ID es un número limpio
    const productId = Number(String(this.product.id).split(':')[0]);

    console.log('Actualizando producto ID:', productId);
    console.log('Data:', productData);

    this.productsService.updateProduct(productId, productData).subscribe({
      next: () => {
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar el producto: ' + (err.error?.message || err.message));
      }
    });
  } else {
    // Crear
    this.productsService.createProduct(productData).subscribe({
      next: () => {
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error al crear:', err);
        alert('Error al crear el producto');
      }
    });
  }
}
  onCancel() {
    this.cancelled.emit();
  }
}
