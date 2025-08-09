import { Routes } from '@angular/router';
import { ShopComponent } from './layout/shop/shop.component';
import { HomeComponent } from './components/home/home.component';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: ShopComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
    ]
  },
];
