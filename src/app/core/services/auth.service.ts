import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  User,
  user,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  public currentUser$ = user(this.auth);

  constructor() { }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
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
          throw new Error('No hay usuario autenticado o el email no está disponible.');
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
