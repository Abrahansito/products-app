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
    if (this.product?.id) {
      // Actualizar
      this.productsService.updateProduct(this.product.id, this.formData).subscribe(() => {
        this.saved.emit();
      });
    } else {
      // Crear
      this.productsService.createProduct(this.formData).subscribe(() => {
        this.saved.emit();
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
  }
}
