import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UiButtonComponent } from '../../../shared/ui/ui-button/ui-button.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ProductFormComponent,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    ConfirmDialogModule,
    UiButtonComponent
  ],
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
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService, private messageService: MessageService
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
                return of([]); //Retorna un array vacío en caso de error
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

  deleteProduct(productId: number) {
  this.confirmationService.confirm({
    message: '¿Estás seguro de eliminar este producto?',
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.productsService.deleteProduct(productId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado correctamente', life: 2000 });
          this.loadProducts();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || err.message || 'No se pudo eliminar' });
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
