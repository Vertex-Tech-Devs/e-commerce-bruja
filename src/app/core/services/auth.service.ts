import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from '@angular/fire/auth';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { user } from '@angular/fire/auth';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private sweetAlertService = inject(SweetAlertService);

  public currentUser$ = user(this.auth);

  constructor() { }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }


  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.sweetAlertService.success('Sesión Cerrada', 'Has sido redirigido a la página de inicio de sesión.');
      this.router.navigate(['/admin/login']);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      this.sweetAlertService.error('Error', 'No se pudo cerrar la sesión. Por favor, inténtalo de nuevo.');
      throw err;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      switchMap(user => [!!user])
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return this.currentUser$.pipe(
      switchMap(user => {
        if (!user || !user.email) {
          return throwError(() => new Error('No hay usuario autenticado o el email no está disponible.'));
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        return from(reauthenticateWithCredential(user, credential)).pipe(
          switchMap(() => from(updatePassword(user, newPassword))),
          tap(() => {
            console.log('Contraseña actualizada exitosamente.');
          }),
          switchMap(() => from(user.reload())),
          switchMap(() => [true])
        );
      })
    );
  }
}
