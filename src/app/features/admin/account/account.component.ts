import { SweetAlertService } from '@core/services/sweet-alert.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmNewPassword');
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
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  private router = inject(Router);

  passwordForm!: FormGroup;
  isSubmitting = false;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, {
      validators: passwordsMatchValidator()
    });
  }

  get f() { return this.passwordForm.controls; }

  async onSubmit(): Promise<void> {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) {
      this.sweetAlertService.error('Formulario inválido', 'Por favor, corrige los errores en el formulario.');
      return;
    }

    this.isSubmitting = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword(currentPassword, newPassword).pipe(
      catchError((error: any) => {
        this.isSubmitting = false;
        let errorMessage = 'Ocurrió un error inesperado al cambiar la contraseña.';

        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
            errorMessage = 'La contraseña actual es incorrecta. Por favor, verifica tus credenciales.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Demasiados intentos fallidos. Por favor, intenta de nuevo más tarde.';
            break;
          case 'auth/requires-recent-login':
            errorMessage = 'Tu sesión ha expirado. Por favor, cierra y vuelve a iniciar sesión.';
            break;
          case 'auth/weak-password':
            errorMessage = 'La nueva contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
            break;
          default:
            errorMessage = `Error: ${error.message || 'Error desconocido'}`;
            break;
        }

        this.sweetAlertService.error('Error al cambiar contraseña', errorMessage);
        return of(false);
      })
    ).subscribe(async (success) => {
      this.isSubmitting = false;
      if (success) {
        this.sweetAlertService.success(
          'Contraseña Actualizada',
          'Para completar el proceso, por favor inicia sesión con tu nueva contraseña.'
        );

        await this.authService.logout();
      }
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
