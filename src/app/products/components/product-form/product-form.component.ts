import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductsService } from '../../services/products';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { UiButtonComponent } from '../../../shared/ui/ui-button/ui-button.component';
import { UiInputTextComponent } from '../../../shared/ui/ui-input-text/ui-input-text.component';
import { UiInputNumberComponent } from '../../../shared/ui/ui-input-number/ui-input-number.component';
import { UiInputTextareaComponent } from '../../../shared/ui/ui-input-textarea/ui-input-textarea.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ToastModule,
    UiButtonComponent,
    UiInputTextComponent,
    UiInputNumberComponent,
    UiInputTextareaComponent
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input() product: any = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  visible: boolean = true;

  //Definimos el formulario reactivo
  form: FormGroup;

  constructor(
      private fb: FormBuilder,
      private productsService: ProductsService,
      private messageService: MessageService
  ) {
    //Inicializamos el formulario con validaciones
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.1)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.product) {
      //Si estamos editando, llenamos el formulario automáticamente
      this.form.patchValue(this.product);
    }
  }

  // Getters para acceder fácilmente a los controles del formulario
  get nameControl(): FormControl { return this.form.get('name') as FormControl; }
  get descControl(): FormControl { return this.form.get('description') as FormControl; }
  get priceControl(): FormControl { return this.form.get('price') as FormControl; }
  get catControl(): FormControl { return this.form.get('category') as FormControl; }

  onSubmit() {
    //Validar antes de enviar
    if (this.form.invalid) {
      this.form.markAllAsTouched(); //Muestra los errores rojos si faltan datos
      return;
    }

    //Obtener los datos del formulario limpio
    const productData = this.form.value;

    if (this.product?.id) {
       const productId = Number(String(this.product.id).split(':')[0]);

       this.productsService.updateProduct(productId, productData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Producto actualizado' });
          this.closeDialog();
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
          this.closeDialog();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear' });
        }
      });
    }
  }

  closeDialog() {
    this.visible = false;
    this.cancelled.emit();
  }
}
