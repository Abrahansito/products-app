import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import Swal from 'sweetalert2';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: any[] = [];
  selectedProduct: any = null;
  showModal = false;
  loading = false;
  errorMessage = '';

  searchTerm = '';
  private search$ = new Subject<string>();
  private sub: Subscription | null = null;

  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.sub = this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          this.loading = true;
          this.errorMessage = '';
          if (!term || term.trim() === '') {
            return this.productsService.getProducts().pipe(
              catchError(err => {
                return of([]); // Retorna un array vacío en caso de error
              })
            );
          }
          return this.productsService.searchProducts(term).pipe(
            catchError(err => {
              return of([]);
            })
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.products = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error en búsqueda:', err);
          this.errorMessage = 'Error al buscar productos';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productsService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Error al cargar productos';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.search$.next(term);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.search$.next('');
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
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Producto eliminado',
              showConfirmButton: false,
              timer: 1500
            });
            this.loadProducts();
          },
          error: (err) => {
            console.error('Error eliminando:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || err.message || 'No se pudo eliminar el producto'
            });
          }
        });
      }
    });
  }

  onSaved(): void {
    this.showModal = false;
    this.loadProducts();
  }

  onCancelled(): void {
    this.showModal = false;
  }
}
