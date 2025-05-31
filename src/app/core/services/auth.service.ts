import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(true); // Temporalmente siempre autenticado

  constructor() {}

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    // TODO: Implementar lógica de login real
    this.isAuthenticatedSubject.next(true);
    return of(true);
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
  }
} 