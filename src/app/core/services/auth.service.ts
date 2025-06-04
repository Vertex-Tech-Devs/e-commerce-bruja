import { inject, Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable((observer) => {
      onAuthStateChanged(this.auth, (user: User | null) => {
        observer.next(!!user);
        observer.complete();
      });
    });
  }
}