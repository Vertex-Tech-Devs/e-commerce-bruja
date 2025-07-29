import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { authGuard } from '@core/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
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
          import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/products/products-list/products-list.component').then(
                (m) => m.ProductsListComponent
              ),
          },
          {
            path: 'create',
            loadComponent: () =>
              import(
                './components/products/product-create/product-create.component'
              ).then((m) => m.ProductCreateComponent),
          },
          {
            path: 'detail/:id',
            loadComponent: () =>
              import('./components/products/product-detail/product-detail.component').then(
                (m) => m.ProductDetailComponent
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./components/products/product-create/product-create.component').then(
                (m) => m.ProductCreateComponent
              ),
          },
        ],
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./components/categories/categories-list/categories-list.component').then(
            (m) => m.CategoriesListComponent
          ),
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/orders/orders-list/orders-list.component').then((m) => m.OrdersListComponent),
          },
          {
            path: 'detail/:id',
            loadComponent: () =>
              import('./components/orders/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
          },
        ],
      },

      {
        path: 'customers',
        loadComponent: () =>
          import('./components/client/clients-list/clients-list.component').then((m) => m.ClientsListComponent),
      },
      {
        path: 'clients/:email/details',
        loadComponent: () =>
          import('./components/client/client-details/client-details.component').then(
            (m) => m.ClientDetailsComponent
          ),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./components/account/account.component').then((m) => m.AccountComponent),
      },
    ],
  },
];
