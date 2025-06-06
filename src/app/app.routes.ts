import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
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
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  }
];