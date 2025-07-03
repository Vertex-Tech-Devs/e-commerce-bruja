import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { authGuard } from '@core/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },

      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./products/products-list/products-list.component').then((m) => m.ProductsListComponent)
          },
          {
            path: 'create', // La URL será /admin/products/create
            loadComponent: () =>
              import(
                './products/product-create/product-create.component'
              ).then((m) => m.ProductCreateComponent),
          },
          {
            path: 'detail/:id',
            loadComponent: () =>
              import('./products/product-detail/product-detail.component').then((m) => m.ProductDetailComponent)
          },
        ]
      }

    ]
  }
];


