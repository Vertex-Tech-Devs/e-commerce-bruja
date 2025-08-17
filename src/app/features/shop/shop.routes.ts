import { Routes } from '@angular/router';
import { ShopComponent } from './layout/shop/shop.component';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'catalog',
        loadComponent: () => import('./components/catalog/catalog.component').then(m => m.CatalogComponent)
      },
      {
        path: 'product',
        loadChildren: () => import('./components/product-detail/product.routes').then(m => m.PRODUCT_ROUTES)
      }
    ]
  }
];
