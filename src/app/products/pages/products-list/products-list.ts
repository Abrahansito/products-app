import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css']
})
export class ProductsListComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  showModal = false;
  loading = false;
  errorMessage = '';

  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    this.loadProducts();
  }

  loadProducts(): void {
    console.log('loadProducts llamado');
    this.loading = true;
    this.errorMessage = '';

    this.productsService.getProducts().subscribe({
      next: (res) => {
        console.log('Respuesta recibida:', res);
        this.products = res;
        this.loading = false;
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Error al cargar productos';
        this.loading = false;
        this.cdr.detectChanges(); //Forzar detección de cambios
      },
      complete: () => {
        console.log('Observable completado');
      }
    });
  }

  openCreate(): void {
    this.selectedProduct = null;
    this.showModal = true;
  }

  openEdit(product: any): void {
    this.selectedProduct = { ...product };
    this.showModal = true;
  }

  delete(id: number): void {
    if (confirm('¿Eliminar producto?')) {
      this.productsService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  onSaved(): void {
    this.showModal = false;
    this.loadProducts();
  }

  onCancelled(): void {
    this.showModal = false;
  }
}
