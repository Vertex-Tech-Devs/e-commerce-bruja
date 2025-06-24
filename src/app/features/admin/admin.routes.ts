// import { Routes } from '@angular/router';
// import { AdminComponent } from './admin.component';
// import { authGuard } from '@core/guards/auth.guard';

// export const adminRoutes: Routes = [
//   {
//     path: '',
//     component: AdminComponent,
//     children: [
//       {
//         path: '',
//         redirectTo: 'dashboard',
//         pathMatch: 'full'
//       },
//       {
//         path: 'dashboard',
//         canActivate: [authGuard],
//         loadComponent: () =>
//           import('./dashboard/dashboard.component').then((m) => m.DashboardComponent)
//       },
//       {
//         path: 'login',
//         loadComponent: () =>
//           import('./login/login.component').then((m) => m.LoginComponent)
//       },
//       {
//         path: 'products',
//         canActivate: [authGuard],
//         loadComponent: () =>
//           import('./products/products-list/products-list.component').then((m) => m.ProductsListComponent)
//       },

//     ]
//   }
// ];

// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { authGuard } from '@core/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then((m) => m.LoginComponent)
      },
      {
        path: 'products',
        canActivate: [authGuard],
        // Aquí es donde anidamos las rutas de detalle y edición
        // Ahora 'products' tendrá rutas hijas.
        children: [
          {
            path: '', // La ruta base '/admin/products' cargará ProductsListComponent
            loadComponent: () =>
              import('./products/products-list/products-list.component').then((m) => m.ProductsListComponent)
          },
          {
            path: 'detail/:id', // La ruta '/admin/products/detail/:id' cargará ProductDetailComponent
            loadComponent: () =>
              import('./products/product-detail/product-detail.component').then((m) => m.ProductDetailComponent)
          },
          {
            path: 'edit/:id', // La ruta '/admin/products/edit/:id' cargará ProductEditComponent
            loadComponent: () =>
              import('./products/product-edit/product-edit.component').then((m) => m.ProductEditComponent)
          }
        ]
      },
      // ... otras rutas que puedas tener en admin
    ]
  }
];
