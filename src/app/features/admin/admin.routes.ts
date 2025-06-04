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
        canActivate: [authGuard],
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: '',
        loadChildren: () =>
          import('./login/login.routes').then((m) => m.loginRoutes),
      },
    ],
  },
];