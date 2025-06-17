import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { authGuard } from '@core/guards/auth.guard';
import { ProductComponent } from './product/product.component';

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
        loadComponent: () =>
          import('./product/product.component').then((m) => m.ProductComponent)
      },

     ]
  }
];
