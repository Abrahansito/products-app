import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { ConfirmationService, MessageService } from 'primeng/api';

import { UiButtonComponent } from '../../../shared/ui/ui-button/ui-button.component';
import { UiInputTextComponent } from '../../../shared/ui/ui-input-text/ui-input-text.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    CardModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    UiButtonComponent,
    UiInputTextComponent,

  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  users: any[] = [];
  loading = true;

  showModal = false
  displayDialog: boolean = false;
  userForm: FormGroup;
  selectedUserId: string | null = null;

  constructor() {
    this.userForm = this.fb.group({
      full_name: ['', Validators.required],
      email: [{value: '', disabled: true}], // El email no se edita
      role: ['', Validators.required]
    });
  }

  //GETTERS PARA EL HTML
  get full_name() { return this.userForm.get('full_name') as FormControl; }
  get email() { return this.userForm.get('email') as FormControl; }
  get role() { return this.userForm.get('role') as FormControl; }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  editUser(user: any) {
    this.selectedUserId = user.id;
    this.userForm.patchValue({
      full_name: user.full_name,
      email: user.email,
      role: user.role
    });
    this.displayDialog = true;
  }

  saveUser() {
    if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
        return;
    }

    const { full_name, role } = this.userForm.value;

    this.authService.updateUser(this.selectedUserId!, { full_name, role }).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Actualizado', detail:'Usuario modificado correctamente'});
        this.displayDialog = false;
        this.loadUsers();
      },
      error: () => {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo actualizar el usuario'});
      }
    });
  }

  deleteUser(user: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar a ${user.full_name}? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.authService.deleteUser(user.id).subscribe({
          next: () => {
            this.messageService.add({severity:'success', summary:'Eliminado', detail:'Usuario eliminado correctamente'});
            this.loadUsers();
          },
          error: () => {
            this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo eliminar'});
          }
        });
      }
    });
  }

 onSaved(): void {
    this.showModal = false;
    this.loadUsers();
  }

  onCancelled(): void {
    this.showModal = false;
  }

}
