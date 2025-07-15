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
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./products/products-list/products-list.component').then(
                (m) => m.ProductsListComponent
              ),
          },
          {
            path: 'create',
            loadComponent: () =>
              import(
                './products/product-create/product-create.component'
              ).then((m) => m.ProductCreateComponent),
          },
          {
            path: 'detail/:id',
            loadComponent: () =>
              import('./products/product-detail/product-detail.component').then(
                (m) => m.ProductDetailComponent
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./products/product-create/product-create.component').then(
                (m) => m.ProductCreateComponent
              ),
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./orders/orders-list/orders-list.component').then((m) => m.OrdersListComponent),
          },
          {
            path: 'detail/:id',
            loadComponent: () =>
              import('./orders/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
          },
        ],
      },

      {
        path: 'customers',
        loadComponent: () =>
          import('./client/clients-list/clients-list.component').then((m) => m.ClientsListComponent),
      },
      {
        path: 'clients/:email/details',
        loadComponent: () =>
          import('./client/client-details/client-details.component').then(
            (m) => m.ClientDetailsComponent
          ),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./account/account.component').then((m) => m.AccountComponent),
      },
    ],
  },
];
