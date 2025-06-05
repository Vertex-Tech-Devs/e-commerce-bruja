import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    take(1),
    tap((isAuth) => {
      if (!isAuth) {
        router.navigate(['/admin/login'], {
          queryParams: { authError: '1' }
        });
      }
    }),
    map((isAuth) => {
      return isAuth;
    })
  );
};