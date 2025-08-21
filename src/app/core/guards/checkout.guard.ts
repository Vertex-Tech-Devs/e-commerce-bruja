import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { map, take } from 'rxjs/operators';

export const checkoutGuard: CanActivateFn = () => {
  const cartService = inject(CartService);
  const router = inject(Router);

  return cartService.itemCount$.pipe(
    take(1),
    map(itemCount => {
      if (itemCount === 0) {
        console.warn('Acceso a /checkout denegado: El carrito está vacío. Redirigiendo...');
        router.navigate(['/shop/cart']);
        return false;
      }

      return true;
    })
  );
};
