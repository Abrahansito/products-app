import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

//Validador personalizado para comparar dos campos de contraseña.
//Se aplica al FormGroup, no a un control individual.
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  //Si alguno de los controles no existe aún, no validamos.
  if (!password || !confirmPassword) {
    return null;
  }

  //Si los valores son diferentes, marcamos el error en el control 'confirmPassword'
  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
  } else {
    // Si coinciden, y el único error era el mismatch, lo limpiamos.
    if (confirmPassword.hasError('passwordMismatch')) {
      delete confirmPassword.errors?.['passwordMismatch'];
      if (Object.keys(confirmPassword.errors || {}).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
  }
  // Retornamos null porque el error lo seteamos directamente en el control hijo.
  return null;
};
