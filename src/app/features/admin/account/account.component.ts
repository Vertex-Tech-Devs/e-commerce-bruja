import { SweetAlertService } from '@core/services/sweet-alert.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

// --- Validador Personalizado para la Coincidencia de Contraseñas ---
export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmNewPassword');
    // Retorna null si los controles no existen o sus valores son nulos.
    if (!password || !confirmPassword) {
      return null;
    }
    if (password.value !== confirmPassword.value && confirmPassword.touched) {
      return { 'passwordsMismatch': true };
    }
    return null;
  };
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  passwordForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private SweetAlertService: SweetAlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      // Campo obligatorio
      currentPassword: ['', [Validators.required]],
      // Obligatorio, mínimo 6 caracteres (requisito por defecto de Firebase)
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      // Obligatorio
      confirmNewPassword: ['', [Validators.required]]
    }, {

      validators: passwordsMatchValidator()
    });
  }

  // Getter de conveniencia para acceder a los controles del formulario en el template
  get f() { return this.passwordForm.controls; }

  async onSubmit(): Promise<void> {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) {
      this.SweetAlertService.error('Formulario inválido', 'Por favor, corrige los errores en el formulario.');
      return;
    }

    this.isSubmitting = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword(currentPassword, newPassword)
      .pipe(
        catchError(error => {
          this.isSubmitting = false;
          let errorMessage = 'Ocurrió un error inesperado al cambiar la contraseña.';
          console.error('Error al cambiar contraseña:', error.code, error.message);

          // Manejo detallado de errores de Firebase Auth
          switch (error.code) {
            case 'auth/wrong-password':
              errorMessage = 'La contraseña actual es incorrecta. Por favor, verifica tus credenciales.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Demasiados intentos fallidos. Por favor, intenta de nuevo más tarde.';
              break;
            case 'auth/requires-recent-login':
              errorMessage = 'Tu sesión ha expirado. Por favor, cierra sesión y vuelve a iniciarla para cambiar tu contraseña.';
              break;
            case 'auth/weak-password':
              errorMessage = 'La nueva contraseña es demasiado débil. Debe tener al menos 6 caracteres y ser más compleja.';
              break;
            default:
              errorMessage = `Error: ${error.message || error.code}`;
              break;
          }
          this.SweetAlertService.error('Error al cambiar contraseña', errorMessage);
          return of(false);
        })
      )
      .subscribe(success => {
        this.isSubmitting = false;
        if (success) {
          this.SweetAlertService.success('Contraseña Actualizada', 'Tu contraseña ha sido actualizada correctamente.');
          this.passwordForm.reset();
        }
      });
  }
}
