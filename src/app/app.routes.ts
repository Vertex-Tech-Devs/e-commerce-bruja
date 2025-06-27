import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'shop',
    loadChildren: () => import('./features/shop/shop.routes').then(m => m.SHOP_ROUTES)
  },
  {
    path: 'product',
    loadChildren: () => import('./features/shop/product-detail/product.routes').then(m => m.PRODUCT_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/shop/cart/cart.routes').then(m => m.CART_ROUTES)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/shop/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/admin/login/login.component').then((m) => m.LoginComponent)
  }
  // Añade una ruta comodín para cualquier otra ruta no encontrada (ej. PageNotFoundComponent)
  // { path: '**', redirectTo: '/admin/dashboard' } // O a una página 404
];
